const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Patient = require('../models/Patient');
// ==================== إنشاء حركة مالية جديدة ====================
// ==================== إنشاء حركة مالية جديدة ====================
exports.createFinancialRecord = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { 
            type, 
            name, 
            amount, 
            description, 
            method, 
            isNewProcedure 
        } = req.body;

        // تحويل القيمة القادمة إلى Boolean حقيقي
        const isNewProcedureBool = isNewProcedure === true || isNewProcedure === 'true';

        const patient = await Patient.findOne({ patientName: name });
        const patientId = patient ? patient._id : null;

        // التحقق من البيانات الأساسية
        if (!type || !name || !amount || !method) {
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                error: true,
                message: 'النوع، الاسم، المبلغ، وطريقة الدفع مطلوبة'
            });
        }

        const parsedAmount = Number(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                error: true,
                message: 'المبلغ غير صحيح'
            });
        }

        // متغير لحفظ الـ Payment فقط إذا لم يكن إجراءً بالدين
        let paymentSaved = false;

        // تحديث حساب المريض إذا كانت العملية إيراد أو إضافة إجراء
        if (type === 'income' && patientId) {

            // جلب المريض عن طريق الـ ID
            const patientObj = await Patient.findById(patientId).session(session);

            if (!patientObj) {
                throw new Error('ملف المريض غير موجود');
            }

            // القيم الحالية لملف المريض المالية
            let totalCost = patientObj.financialRecord?.totalCost || 0;
            let totalPaid = patientObj.financialRecord?.totalPaid || 0;
            let paymentsHistory = patientObj.financialRecord?.paymentsHistory || [];

            if (isNewProcedureBool) {
                // 1. حالة إجراء جديد (تكلفة/دين فقط بدون كاش دخل الخزنة):
                totalCost += parsedAmount;
                // هنا لا نقوم بعمل Payment عام للعيادة لأن الخزنة لم يدخلها مال
            } else {
                // 2. حالة تسديد دين (كاش دخل الخزنة فعلياً):
                totalPaid += parsedAmount;
                
                // نقوم بإنشاء وحفظ الحركة المالية العامة كإيراد للعيادة
                const newPayment = new Payment({
                    type,
                    name,
                    amount: parsedAmount,
                    description: description || "",
                    method,
                    patientId: patientId || null
                });
                await newPayment.save({ session });
                paymentSaved = true;
            }

            // حساب الدين المتبقي للمريض بشكل صحيح
            const remainingDebt = Math.max(0, totalCost - totalPaid);

            // إضافة الحركة في سجل المريض الداخلي للتوثيق
            paymentsHistory.push({
                amount: parsedAmount,
                method,
                description: isNewProcedureBool
                    ? `إجراء جديد (ذمم): ${description || ""}`
                    : `سداد دين: ${description || ""}`,
                date: new Date().toISOString().split('T')[0]
            });

            // تحديث بيانات المريض المالية
            patientObj.financialRecord = {
                totalCost,
                totalPaid,
                remainingDebt,
                paymentsHistory
            };

            patientObj.lastVisit = new Date().toISOString().split('T')[0];

            // حفظ المريض
            await patientObj.save({ session });

        } else if (type === 'expense') {
            // 3. حالة المصاريف التشغيلية (تُحفظ دائماً كـ Payment من نوع مصروف)
            const newPayment = new Payment({
                type,
                name,
                amount: parsedAmount,
                description: description || "",
                method,
                patientId: null
            });
            await newPayment.save({ session });
        }

        // تأكيد العملية في قاعدة البيانات
        await session.commitTransaction();
        session.endSession();

        // صياغة رسالة النجاح بناءً على نوع العملية
        let successMessage = 'تم تسجيل العملية بنجاح';
        if (type === 'income' && patientId) {
            successMessage = isNewProcedureBool 
                ? 'تم إضافة التكلفة على دين المريض بنجاح (ولم تُسجل كإيراد نقدي)' 
                : 'تم تسجيل الدفعة النقدية وتحديث حساب المريض بنجاح';
        } else {
            successMessage = 'تم تسجيل المصروف بنجاح';
        }

        return res.status(201).json({
            error: false,
            message: successMessage
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            error: true,
            message: error.message || 'حدث خطأ أثناء حفظ الحركة المالية'
        });
    }
};
// ==================== 2. جلب كشف الحركات المالية (GET) ====================
exports.getFinancialRecords = async (req, res) => {
    try {
        // جلب السجلات المالية وترتيبها من الأحدث للأقدم
        const payments = await Payment.find().sort({ date: -1 });
        
        return res.status(200).json({ error: false, data: payments });
    } catch (error) {
        return res.status(500).json({ error: true, message: 'فشل في استرجاع كشف الحركات المالية' });
    }
};