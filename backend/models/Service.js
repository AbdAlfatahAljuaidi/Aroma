const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, "اسم الخدمة مطلوب"],
        trim: true
    },
    category: {
        type: String,
        default: "أسنان عام",
        trim: true
    },
    expectedTime: {
        type: String,
        required: [true, "الوقت المتوقع مطلوب"]
    },
    basePrice: {
        type: Number,
        required: [true, "السعر الأساسي مطلوب"]
    },
    status: {
        type: String,
        default: "قيد المراجعة",
        trim: true
    }
}, { timestamps: true }); // تولد تلقائياً حقول createdAt و updatedAt

module.exports = mongoose.model('Service', serviceSchema);