const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "اسم الموظف مطلوب"],
        trim: true,
        unique: true // منع تكرار نفس الاسم نهائياً في النظام
    },
    password: {
        type: String,
        required: [true, "كلمة المرور مطلوبة"]
    },
    role: {
        type: String,
        enum: ["employee", "doctor", "admin"],
        default: "employee" // الدور الافتراضي للمسجلين الجدد
    }
}, { 
    timestamps: true // يقوم بإنشاء حقول createdAt و updatedAt تلقائياً في قاعدة البيانات
});

module.exports = mongoose.model('Employee', employeeSchema);