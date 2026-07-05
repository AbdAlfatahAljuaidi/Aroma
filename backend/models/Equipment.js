const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    equipmentName: {
        type: String,
        required: [true, "اسم الجهاز مطلوب"],
        trim: true
    },
    lastMaintenanceDate: {
        type: String,
        default: "لم تحدد بعد"
    },
    nextMaintenanceDate: {
        type: String,
        required: [true, "تاريخ الفحص القادم مطلوب"]
    },
    status: {
        type: String,
        enum: ["يعمل بكفاءة", "تحت الصيانة", "عاطل"],
        default: "يعمل بكفاءة"
    },
    location: {
        type: String,
        required: [true, "موقع الجهاز مطلوب"],
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);