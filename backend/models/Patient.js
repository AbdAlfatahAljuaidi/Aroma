const mongoose = require('mongoose');

// السكيمة الفرعية لحركات الدفع الخاصة بالمريض
const paymentSchema = new mongoose.Schema({
    amount: { 
        type: Number, 
        required: [true, "مبلغ الدفعة مطلوب"] 
    },
    method: { 
        type: String, 
        required: [true, "طريقة الدفع مطلوبة"], 
        default: "نقداً" 
    },
    description: { 
        type: String, 
        default: "" 
    },
    date: { 
        type: String, 
        required: [true, "تاريخ الدفعة مطلوب"],
        default: () => new Date().toISOString().split('T')[0] // توليد التاريخ تلقائياً كـ String إن لم يُرسل
    }
});

// السكيمة الرئيسية لملف المريض
const patientSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: [true, "اسم المريض مطلوب"],
        trim: true
    },
    age: {
        type: Number,
        required: [true, "عمر المريض مطلوب"]
    },
    phone: {
        type: String,
        required: [true, "رقم الهاتف مطلوب"]
    },
    lastVisit: {
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    },
    medicalAlert: {
        type: String,
        default: "لا يوجد تنبيهات طبية"
    },
    clinicalNotes: {
        type: String,
        required: [true, "التفاصيل السريرية مطلوبة"]
    },
    financialRecord: {
        totalCost: { type: Number, default: 0 },
        totalPaid: { type: Number, default: 0 },
        remainingDebt: { type: Number, default: 0 },
        paymentsHistory: [paymentSchema] // دمج سكيمة الدفعات كـ Subdocument Array
    }
}, { timestamps: true }); // توليد حقول createdAt و updatedAt تلقائياً

module.exports = mongoose.model('Patient', patientSchema);