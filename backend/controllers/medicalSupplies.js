const MedicalSupply = require('../models/MedicalSupply'); // استدعاء موديل المستلزمات الطبية لـ MongoDB

// ==================== 1. جلب المستلزمات الطبية (GET) ====================
const getAllSupplies = async (req, res) => {
    try {
        // جلب المستلزمات وترتيبها بالأحدث أولاً بناءً على تاريخ الإنشاء
        const suppliesData = await MedicalSupply.find().sort({ createdAt: -1 });
        
        const supplies = suppliesData.map(doc => {
            const currentQuantity = Number(doc.quantity) || 0;
            const minQuantity = Number(doc.minRequiredQuantity) || 0;
            
            // تحديد الحالة تلقائياً وحركياً بناءً على الكمية المتاحة لجدول الفرونت إند
            let status = "آمن";
            if (currentQuantity === 0) {
                status = "نفذت الكمية";
            } else if (currentQuantity <= minQuantity) {
                status = "منخفض (بحاجة لطلب)";
            }

            return {
                id: doc._id,
                itemName: doc.supplyName,        // ربط الحقل المتوقع بالفرونت إند مع الموديل
                category: doc.category,
                currentQuantity,
                minQuantity,
                status,                          // الحالة المحسوبة ديناميكياً لسلامة البيانات
                notes: doc.unit ? `الواحدة: ${doc.unit}` : ""
            };
        });

        return res.status(200).json({
            success: true,
            data: supplies
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب المستلزمات الطبية",
            error: error.message
        });
    }
};

// ==================== 2. إضافة مستلزم طبي جديد (POST) ====================
const createSupply = async (req, res) => {
    try {
        const { itemName, category, currentQuantity, minQuantity, notes } = req.body;

        // التحقق من الحقول المطلوبة
        if (!itemName || currentQuantity === undefined || minQuantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "يرجى إدخال اسم المادة، الكمية الحالية، والحد الأدنى"
            });
        }

        // إنشاء مستند المستلزم الجديد وحفظه في MongoDB
        const newSupply = new MedicalSupply({
            supplyName: itemName,
            category: category || undefined,
            quantity: Number(currentQuantity),
            minRequiredQuantity: Number(minQuantity),
            unit: "قطعة" // القيمة الافتراضية للوحدات الطبية بالعيادة
        });

        await newSupply.save();

        return res.status(201).json({
            success: true,
            message: "تمت إضافة المادة الطبية بنجاح",
            data: {
                id: newSupply._id,
                itemName: newSupply.supplyName,
                category: newSupply.category,
                currentQuantity: newSupply.quantity,
                minQuantity: newSupply.minRequiredQuantity,
                status: newSupply.quantity === 0 ? "نفذت الكمية" : (newSupply.quantity <= newSupply.minRequiredQuantity ? "منخفض (بحاجة لطلب)" : "آمن"),
                notes: notes || ""
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء إضافة المادة الطبية",
            error: error.message
        });
    }
};

// ==================== 3. تحديث بيانات مستلزم طبي (PUT) ====================
const updateSupply = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemName, category, currentQuantity, minQuantity, notes } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "معرف المادة الطبية (ID) مطلوب"
            });
        }

        const supply = await MedicalSupply.findById(id);

        if (!supply) {
            return res.status(404).json({
                success: false,
                message: "المادة الطبية المطلوبة غير موجودة"
            });
        }

        // تحديث الحقول بشكل مرن وديناميكي داخل كائن الـ Document المسترجع
        if (itemName !== undefined) supply.supplyName = itemName;
        if (category !== undefined) supply.category = category;
        if (currentQuantity !== undefined) supply.quantity = Number(currentQuantity);
        if (minQuantity !== undefined) supply.minRequiredQuantity = Number(minQuantity);

        await supply.save();

        // إعادة حساب الـ status الراجع لتحديث الفرونت إند والجدول فوراً
        const cQty = Number(supply.quantity) || 0;
        const mQty = Number(supply.minRequiredQuantity) || 0;
        
        let calculatedStatus = "آمن";
        if (cQty === 0) {
            calculatedStatus = "نفذت الكمية";
        } else if (cQty <= mQty) {
            calculatedStatus = "منخفض (بحاجة لطلب)";
        }

        return res.status(200).json({
            success: true,
            message: "تم تحديث المادة الطبية بنجاح",
            data: {
                id: supply._id,
                itemName: supply.supplyName,
                category: supply.category,
                currentQuantity: supply.quantity,
                minQuantity: supply.minRequiredQuantity,
                status: calculatedStatus
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء تحديث المادة الطبية",
            error: error.message
        });
    }
};

// ==================== 4. حذف مستلزم طبي نهائياً (DELETE) ====================
const deleteSupply = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "معرف المادة الطبية (ID) مطلوب لإتمام عملية الحذف"
            });
        }

        const deletedSupply = await MedicalSupply.findByIdAndDelete(id);

        if (!deletedSupply) {
            return res.status(404).json({
                success: false,
                message: "المادة الطبية غير موجودة أو تم حذفها مسبقاً"
            });
        }

        return res.status(200).json({
            success: true,
            message: "تم حذف المادة الطبية بنجاح"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء حذف المادة الطبية",
            error: error.message
        });
    }
};

module.exports = {
    getAllSupplies,
    createSupply,
    updateSupply,
    deleteSupply
};