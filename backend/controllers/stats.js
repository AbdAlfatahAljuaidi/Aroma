const Patient = require('../models/Patient'); // استدعاء موديل المرضى لـ MongoDB
const Appointment = require('../models/Appointment'); // استدعاء موديل المواعيد لـ MongoDB
const Payment = require('../models/Payment'); // استدعاء موديل الحركات المالية لـ MongoDB

exports.getClinicStatistics = async (req, res) => {
    try {
        // 1. جلب إجمالي عدد المرضى المسجلين بالمنظومة (سريع ومباشر)
        const totalPatients = await Patient.countDocuments();

        // 2. جلب إجمالي عدد المواعيد المحجوزة بالمنظومة
        const totalAppointments = await Appointment.countDocuments();

        // 3. احتساب الإيرادات والخصومات باستخدام الـ Aggregation Pipeline في MongoDB لأعلى أداء
        const revenueData = await Payment.aggregate([
            { $match: { type: 'income' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' },
                    totalDiscounts: { $sum: { $ifNull: ['$discountAmount', 0] } } // حماية في حال لم يكن الحقل موجوداً
                }
            }
        ]);

        // استخراج القيم المحسوبة أو وضع 0 كقيمة افتراضية
        let totalRevenue = revenueData[0]?.totalRevenue || 0;
        let totalDiscounts = revenueData[0]?.totalDiscounts || 0;

        // 4. Fallback: في حال كانت الحركات المالية فارغة، يمكن حسابها أولياً من سجلات المرضى المالية المتاحة
        if (totalRevenue === 0) {
            const patientsBills = await Patient.find({ 'financialRecord.totalPaid': { $gt: 0 } });
            patientsBills.forEach(doc => {
                const paid = parseFloat(doc.financialRecord?.totalPaid) || 0;
                totalRevenue += paid;
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                totalPatients,
                totalAppointments,
                totalRevenue, // المجموع الفعلي الصحيح للإيرادات
                totalDiscounts
            }
        });

    } catch (error) {
        console.error("Error fetching database statistics:", error);
        return res.status(500).json({
            success: false,
            message: "حدث خطأ داخلي أثناء احتساب الإحصائيات الحيوية للعيادة",
            error: error.message
        });
    }
};