const mongoose = require('mongoose');

const medicalSupplySchema = new mongoose.Schema({
    supplyName: {
        type: String,
        required: [true, "اسم المستلزم الطبي أو الدواء مطلوب"],
        trim: true
    },
    category: {
        type: String,
        default: "عام",
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, "الكمية الحالية مطلوبة"],
        default: 0
    },
    minRequiredQuantity: {
        type: Number,
        required: [true, "الحد الأدنى الآمن مطلوب"],
        default: 0
    },
    unit: {
        type: String,
        default: "قطعة",
        trim: true
    },
    notes: {
        type: String,
        default: "",
        trim: true
    }
}, { 
    timestamps: true // لإنشاء حقول createdAt و updatedAt تلقائياً للترتيب والمتابعة الزمنية
});

module.exports = mongoose.model('MedicalSupply', medicalSupplySchema);