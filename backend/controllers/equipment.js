
// اسم المجموعة (Collection) في قاعدة بيانات Firestore
const EQUIPMENT_COLLECTION = 'medicalEquipment';

/**
 * 1. جلب جميع الأجهزة الطبية (GET)
 * يدعم الترتيب التلقائي بحسب تاريخ الإضافة ليعرض الأحدث أولاً
 */
const getAllEquipment = async (req, res) => {
    try {
        const snapshot = await db.collection(EQUIPMENT_COLLECTION).orderBy('createdAt', 'desc').get();
        const equipmentList = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            
            equipmentList.push({
                id: doc.id,
                equipmentName: data.equipmentName,       // اسم الجهاز الطبي
                location: data.location,                 // موقع التواجد
                lastMaintenance: data.lastMaintenance,   // تاريخ آخر صيانة
                nextMaintenance: data.nextMaintenance,   // الفحص الدوري القادم
                status: data.status || "يعمل بكفاءة",     // الحالة التشغيلية
            });
        });

        return res.status(200).json({
            success: true,
            data: equipmentList
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب قائمة الأجهزة الطبية",
            error: error.message
        });
    }
};

/**
 * 2. إضافة جهاز طبي جديد (POST)
 * يستقبل البيانات من الفرونت إند ويقوم بحفظها في Firestore
 */
const createEquipment = async (req, res) => {
    try {
        const { equipmentName, location, lastMaintenance, nextMaintenance, status } = req.body;

        // التحقق من الحقول الإلزامية لتفادي إدخال بيانات فارغة وقصيرة
        if (!equipmentName || !location || !nextMaintenance) {
            return res.status(400).json({
                success: false,
                message: "الحقول الأساسية مطلوبة: (اسم الجهاز، موقع التواجد، وتاريخ الفحص القادم)"
            });
        }

        // بناء الكائن وتأمين القيم الافتراضية
        const newEquipment = {
            equipmentName,
            location,
            lastMaintenance: lastMaintenance || "لم تحدد بعد",
            nextMaintenance,
            status: status || "يعمل بكفاءة",
            createdAt: new Date() // لتسهيل الفلترة والترتيب اللاحق
        };

        // إدراج المستند في Firestore
        const docRef = await db.collection(EQUIPMENT_COLLECTION).add(newEquipment);

        return res.status(201).json({
            success: true,
            message: "تم تسجيل الجهاز الطبي بنجاح بالمنظومة",
            data: { id: docRef.id, ...newEquipment }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ داخل الخادم أثناء إضافة الجهاز الطبي الجديد",
            error: error.message
        });
    }
};

module.exports = {
    getAllEquipment,
    createEquipment
};