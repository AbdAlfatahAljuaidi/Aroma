const Employee = require('../models/Employee'); // استدعاء موديل الموظفين الخاص بـ MongoDB
const bcrypt = require('bcryptjs'); // استخدام bcryptjs لمنع مشاكل بيئة تشغيل Render

// ==================== تسجيل الدخول (POST) ====================
const loginEmployee = async (req, res) => {
    try {
        const { name, password } = req.body;
        console.log("name from request:", name);

        // 1. التحقق من إدخال الحقول المطلوبة
        if (!name || !password) {
            return res.status(400).json({
                success: false,
                message: "يرجى إدخال اسم المستخدم وكلمة المرور"
            });
        }

        // 2. البحث عن الموظف في MongoDB بناءً على الاسم
        const employee = await Employee.findOne({ name: name.trim() });

        // إذا لم يتم العثور على الموظف
        if (!employee) {
            return res.status(401).json({
                success: false,
                message: "اسم المستخدم أو كلمة المرور غير صحيحة"
            });
        }

        // 3. مقارنة كلمة المرور المدخلة بالكلمة المشفرة في قاعدة البيانات
        const isPasswordValid = await bcrypt.compare(password, employee.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "اسم المستخدم أو كلمة المرور غير صحيحة"
            });
        }

        /* 4. إرسال الاستجابة للفرونت إند:
           بناءً على شرط الفرونت إند: data.client === "false" للتوجه للـ Dashboard
        */
        return res.status(200).json({
            success: true,
            message: "تم تسجيل الدخول بنجاح!",
            client: "false", // النص المتوقع في كود الفرونت إند لتوجيهه إلى لوحة التحكم
            user: {
                id: employee._id, // تحويلها لـ _id المتوافقة مع المونجو
                name: employee.name,
                role: employee.role || "employee"
            }
        });

    } catch (error) {
        console.error("Error in loginEmployee:", error);
        return res.status(500).json({
            success: false,
            message: "حدث خطأ في السيرفر أثناء محاولة تسجيل الدخول",
            error: error.message
        });
    }
};

// ==================== تسجيل الخروج (POST) ====================
const logoutEmployee = async (req, res) => {
    try {
        // في حال استخدام الـ LocalStorage محلياً، الباك إند يرسل فقط استجابة نجاح لتأكيد العملية
        return res.status(200).json({
            success: true,
            message: "تم تسجيل الخروج بنجاح"
        });
    } catch (error) {
        console.error("Error in logoutEmployee:", error);
        return res.status(500).json({
            success: false,
            message: "حدث خطأ في السيرفر أثناء محاولة تسجيل الخروج",
            error: error.message
        });
    }
};

module.exports = {
    loginEmployee,
    logoutEmployee
};