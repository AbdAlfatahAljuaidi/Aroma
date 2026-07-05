const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        default: null // يمكن ربطه اختيارياً لاحقاً بملف المريض
    },
    patientName: {
        type: String,
        required: [true, "اسم المريض مطلوب"]
    },
    doctorName: {
        type: String,
        required: [true, "اسم الدكتور مطلوب"]
    },
    appointmentDate: {
        type: String,
        required: [true, "تاريخ الموعد مطلوب"]
    },
    appointmentDay: {
        type: String,
        required: [true, "يوم الموعد مطلوب"] // إضافة الحقل لمطابقة بيانات الفرونت إند
    },
    appointmentTime: {
        type: String,
        required: [true, "وقت الموعد مطلوب"]
    },
    treatment: {
        type: String,
        required: [true, "الإجراء الطبي مطلوب"]
    },
    status: {
        type: String,
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);