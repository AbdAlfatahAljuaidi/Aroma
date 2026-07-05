const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: [true, "اسم الطبيب مطلوب"],
        trim: true
    },
    specialty: {
        type: String,
        default: "طب وجراحة الفم والأسنان",
        trim: true
    },
    phone: {
        type: String,
        required: [true, "رقم هاتف الطبيب مطلوب"]
    },
    email: {
        type: String,
        default: "",
        trim: true
    },
    workingDays: {
        type: [String], 
        default: []
    },
    status: {
        type: String,
        enum: ["نشط", "إجازة", "غير نشط"],
        default: "نشط"
    }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);