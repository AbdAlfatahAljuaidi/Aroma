const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['income', 'expense'], // income = إيرادات، expense = مصروفات
        required: [true, "نوع الحركة المالية مطلوب"]
    },
    name: {
        type: String,
        required: [true, "اسم الجهة أو المريض مطلوب"],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, "المبلغ المالي مطلوب"],
        min: [0, "لا يمكن للمبلغ أن يكون سالباً"]
    },
    description: {
        type: String,
        default: ""
    },
    method: {
        type: String,
        required: [true, "طريقة الدفع مطلوبة"], // كاش، فيزا، الخ
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);