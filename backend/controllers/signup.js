const Employee = require('../models/Employee'); // استدعاء موديل الموظفين الخاص بـ MongoDB
const bcrypt = require('bcryptjs'); // استبدالها بـ bcryptjs لتجنب مشاكل بيئة تشغيل Render

// ==================== تسجيل موظف/طبيب جديد (POST) ====================
const registerEmployee = async (req, res) => {
    try {
        const { name, password, confirmPassword, systemPassword } = req.body;

        const checkPass = "ZEoc@2026";

        if (checkPass !== systemPassword) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "كلمة المرور الخاصة بالنظام غير صحيحة!"
            });
        }

        // 1. التحقق من الحقول المطلوبة
        if (!name || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "يرجى ملء جميع الحقول المطلوبة"
            });
        }

        // 2. التحقق من تطابق كلمات المرور
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "كلمات المرور غير متطابقة!"
            });
        }

        // 3. التحقق مما إذا كان اسم المستخدم مسجلاً مسبقاً في MongoDB لمنع التكرار
        const existingEmployee = await Employee.findOne({ name: name.trim() });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "اسم الموظف مسجل بالفعل في النظام، يرجى اختيار اسم آخر"
            });
        }

        // 4. تشفير كلمة المرور لحمايتها (Hashing)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 5. إنشاء وتجهيز كائن الموظف الجديد بناءً على الـ Schema للمونجو
        const newEmployee = new Employee({
            name: name.trim(),
            password: hashedPassword, // تخزين الكلمة المشفرة فقط
            role: "employee"          // دور افتراضي (يأخذ القيمة من الـ Schema تلقائياً)
        });

        // 6. الحفظ الفعلي في قاعدة بيانات MongoDB
        await newEmployee.save();

        // 7. إرسال استجابة نجاح مطابقة لتوقعات الفرونت إند
        return res.status(201).json({
            success: true,
            error: false,
            message: "تم تسجيل الحساب بنجاح!",
            data: {
                id: newEmployee._id, // المونجو تحفظ الـ ID في حقل _id
                name: newEmployee.name,
                role: newEmployee.role
            }
        });

    } catch (error) {
        console.error("Error in registerEmployee:", error);
        return res.status(500).json({
            success: false,
            error: true,
            message: "حدث خطأ أثناء تسجيل الحساب في السيرفر",
            errorMessage: error.message
        });
    }
};

module.exports = {
    registerEmployee
};