const Patient = require('../models/Patient');

// 1. إضافة مريض جديد (POST)
const createPatient = async (req, res) => {
    try {
        const { 
            patientName, 
            age, 
            phone, 
            lastVisit, 
            medicalAlert, 
            clinicalNotes, 
            financialRecord 
        } = req.body;

        console.log("Received patient data:", req.body);

        // التحقق من الحقول الأساسية المطلوبة لمنع إدخال بيانات فارغة
        if (!patientName || !age || !phone || !clinicalNotes) {
            return res.status(400).json({
                success: false,
                message: "الحقول الأساسية مطلوبة (الاسم، العمر، الهاتف، وتفاصيل السجل المرجعي)"
            });
        }

        // حساب الحقول المالية وضمان أنها أرقام صالحة
        const totalCost = Number(financialRecord?.totalCost) || 0;
        const totalPaid = Number(financialRecord?.totalPaid) || 0;
        const remainingDebt = Math.max(0, totalCost - totalPaid);

        // تنظيف ومعالجة مصفوفة الدفعات (paymentsHistory) لتجنب توقف السيرفر (Validation Bypass)
        const incomingHistory = financialRecord?.paymentsHistory || [];
        const sanitizedHistory = incomingHistory.map(payment => ({
            amount: Number(payment.amount) || totalPaid || 0, // Fallback للمدفوع الإجمالي إذا نقص
            method: payment.method || "نقداً",               // قيمة افتراضية لطريقة الدفع
            description: payment.description || "دفعة افتتاحية عند التسجيل",
            date: payment.date || new Date().toISOString().split('T')[0] // تأمين حقل التاريخ بصيغة String
        }));

        // بناء مستند المريض الجديد
        const newPatient = new Patient({
            patientName,
            age: Number(age),
            phone,
            lastVisit: lastVisit || undefined, 
            medicalAlert: medicalAlert || undefined,
            clinicalNotes, 
            financialRecord: {
                totalCost,
                totalPaid,
                remainingDebt,
                paymentsHistory: sanitizedHistory // تمرير المصفوفة الآمنة والمكتملة
            }
        });

        console.log("Saving patient process started...");
        
        // حفظ المستند في MongoDB
        await newPatient.save();
        
        console.log("Patient saved successfully!");

        return res.status(201).json({
            success: true,
            message: "تم تسجيل ملف المريض السريري والمالي بنجاح",
            data: newPatient
        });

    } catch (error) {
        console.error("Mongoose Save Error:", error); // طباعة تفاصيل الخطأ بدقة في الكونسول لتسهيل التتبع
        return res.status(500).json({
            success: false,
            message: "حدث خطأ داخلي أثناء إضافة المريض وتجهيز الحسابات",
            error: error.message
        });
    }
};

// 2. جلب جميع المرضى (GET)
const getAllPatients = async (req, res) => {
    try {
        // ترتيب تنازلي حسب تاريخ الإنشاء
        const patients = await Patient.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: patients
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب سجلات المرضى المحدثة",
            error: error.message
        });
    }
};

// 3. جلب مريض واحد محدد بواسطة الـ ID (GET)
const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "ملف المريض غير موجود بالمنظومة"
            });
        }

        return res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب بيانات المريض المطلوبة",
            error: error.message
        });
    }
};

// 4. تعديل وتحديث بيانات المريض (PUT)
const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            patientName, 
            age, 
            phone, 
            lastVisit, 
            medicalAlert, 
            clinicalNotes, 
            financialRecord 
        } = req.body;

        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "ملف المريض المراد تعديله غير موجود"
            });
        }

        // احتساب الحقول المالية بدقة في حال تعديلها
        const totalCost = financialRecord?.totalCost !== undefined ? Number(financialRecord.totalCost) : patient.financialRecord.totalCost;
        const totalPaid = financialRecord?.totalPaid !== undefined ? Number(financialRecord.totalPaid) : patient.financialRecord.totalPaid;
        const remainingDebt = Math.max(0, totalCost - totalPaid);

        // تحديث الحقول مباشرة في كائن الـ Document المسترجع
        patient.patientName = patientName || patient.patientName;
        patient.age = age ? Number(age) : patient.age;
        patient.phone = phone || patient.phone;
        patient.lastVisit = lastVisit || patient.lastVisit;
        patient.medicalAlert = medicalAlert || patient.medicalAlert;
        patient.clinicalNotes = clinicalNotes || patient.clinicalNotes;
        patient.financialRecord = {
            totalCost,
            totalPaid,
            remainingDebt,
            paymentsHistory: financialRecord?.paymentsHistory || patient.financialRecord.paymentsHistory
        };

        await patient.save();

        return res.status(200).json({
            success: true,
            message: "تم تحديث بيانات ملف المريض والحسابات المالية بنجاح",
            data: patient
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ داخلي أثناء تحديث بيانات المريض",
            error: error.message
        });
    }
};

// 5. حذف ملف مريض (DELETE)
const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPatient = await Patient.findByIdAndDelete(id);

        if (!deletedPatient) {
            return res.status(404).json({
                success: false,
                message: "ملف المريض غير موجود أو تم حذفه مسبقاً"
            });
        }

        return res.status(200).json({
            success: true,
            message: "تم حذف ملف المريض بالكامل من المنظومة بنجاح"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء محاولة حذف المريض",
            error: error.message
        });
    }
};

module.exports = { 
    createPatient, 
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient
};