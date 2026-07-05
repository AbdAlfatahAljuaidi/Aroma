const Service = require('../models/Service'); // استدعاء موديل الخدمات الجديد

// ==================== 1. جلب جميع الخدمات الطبية (GET) ====================
const getAllServices = async (req, res) => {
    try {
        // جلب جميع الخدمات وترتيبها بالأحدث أولاً باستخدام حقل createdAt التلقائي
        const services = await Service.find().sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            data: services
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب الخدمات الطبية من قاعدة البيانات",
            error: error.message
        });
    }
};

// ==================== 2. إضافة خدمة طبية جديدة (POST) ====================
const createService = async (req, res) => {
    try {
        const { serviceName, category, expectedTime, basePrice, status } = req.body;
        
        // التحقق من المدخلات الأساسية
        if (!serviceName || !expectedTime || !basePrice) {
            return res.status(400).json({
                success: false,
                message: "يرجى ملء جميع الحقول المطلوبة (اسم الخدمة، الوقت المتوقع، السعر الأساسي)"
            });
        }
        
        // إنشاء الخدمة الجديدة وحفظها في MongoDB
        const newService = new Service({
            serviceName,
            category, // يأخذ القيمة الافتراضية بالموديل إن لم تتوفر
            expectedTime,
            basePrice,
            status
        });
        
        await newService.save();
        
        console.log("sdasdasaddsaaaaaaaa");
        return res.status(201).json({
            success: true,
            message: "تمت إضافة الخدمة الطبية بنجاح إلى قاعدة البيانات",
            data: newService
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء حفظ الخدمة الطبية الجديدة",
            error: error.message
        });
    }
};

// ==================== 3. تحديث خدمة طبية موجودة (PUT) ====================
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { serviceName, category, expectedTime, basePrice, status } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "معرف الخدمة (ID) مطلوب لإتمام عملية التحديث"
            });
        }

        // تحديث البيانات ديناميكياً مع تفعيل حقول الـ Validation وإرجاع المستند بعد التعديل
        const updatedService = await Service.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...(serviceName !== undefined && { serviceName }),
                    ...(category !== undefined && { category }),
                    ...(expectedTime !== undefined && { expectedTime }),
                    ...(basePrice !== undefined && { basePrice: Number(basePrice) }),
                    ...(status !== undefined && { status })
                }
            },
            { new: true, runValidators: true } 
        );

        if (!updatedService) {
            return res.status(404).json({
                success: false,
                message: "الخدمة الطبية المطلوبة غير موجودة"
            });
        }

        return res.status(200).json({
            success: true,
            message: "تم تحديث الخدمة الطبية بنجاح",
            data: updatedService
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء تحديث الخدمة الطبية",
            error: error.message
        });
    }
};

// ==================== 4. حذف خدمة طبية نهائياً (DELETE) ====================
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "معرف الخدمة (ID) مطلوب لإتمام عملية الحذف"
            });
        }

        // حذف الخدمة باستخدام findIdAndDelete
        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({
                success: false,
                message: "الخدمة الطبية المطلوبة غير موجودة أو تم حذفها مسبقاً"
            });
        }

        return res.status(200).json({
            success: true,
            message: "تم حذف الخدمة الطبية بنجاح من قاعدة البيانات"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء حذف الخدمة الطبية",
            error: error.message
        });
    }
};

module.exports = {
    getAllServices,
    createService,
    updateService,
    deleteService
};