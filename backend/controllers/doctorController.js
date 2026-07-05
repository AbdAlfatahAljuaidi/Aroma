const Doctor = require('../models/Doctor'); // استدعاء موديل الأطباء لـ MongoDB

// ==================== 1. إنشاء حساب وبيانات طبيب جديد (Create) ====================
exports.createDoctor = async (req, res) => {
    try {
        const { name, specialty, phone, email, schedule } = req.body;

        // التحقق من الحقول الأساسية
        if (!name || !specialty || !phone) {
            return res.status(400).json({ success: false, message: 'الحقول الأساسية مطلوبة (الاسم، التخصص، رقم الاتصال)' });
        }

        // إنشاء وثيقة الطبيب الجديدة بناءً على الـ Schema
        const newDoctor = new Doctor({
            doctorName: name, // مطابقة اسم الحقل في موديل المونجو
            specialty,
            phone,
            email: email || '',
            workingDays: schedule || [] // تخزين المصفوفة في حقل الأيام المتاح بالموديل
        });

        await newDoctor.save();

        return res.status(201).json({
            success: true,
            message: 'تم تسجيل بيانات الطبيب بنجاح',
            id: newDoctor._id
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'فشل في إنشاء حساب الطبيب' });
    }
};

// ==================== 2. جلب قائمة جميع الأطباء بالمنظومة (Get All) ====================
exports.getAllDoctors = async (req, res) => {
    try {
        // جلب الأطباء وترتيبهم أبجدياً بحسب الاسم
        const doctorsData = await Doctor.find().sort({ doctorName: 1 });
        
        // تحويل الهيكل الخارجي ليطابق توقعات الفرونت إند (id بدلاً من _id و name بدلاً من doctorName)
        const doctors = doctorsData.map(doc => ({
            id: doc._id,
            name: doc.doctorName,
            specialty: doc.specialty,
            phone: doc.phone,
            email: doc.email,
            schedule: doc.workingDays,
            status: doc.status
        }));

        return res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'فشل في استرجاع قائمة الأطباء' });
    }
};

// ==================== 3. جلب بيانات طبيب محدد بواسطة الـ ID (Get Single) ====================
exports.getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Doctor.findById(id);

        if (!doc) {
            return res.status(404).json({ success: false, message: 'ملف الطبيب غير موجود بالمنظومة' });
        }

        return res.status(200).json({ 
            success: true, 
            data: { 
                id: doc._id, 
                name: doc.doctorName,
                specialty: doc.specialty,
                phone: doc.phone,
                email: doc.email,
                schedule: doc.workingDays,
                status: doc.status
            } 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب بيانات الطبيب' });
    }
};

// ==================== 4. تحديث بيانات الطبيب (Update) ====================
exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specialty, phone, email, schedule } = req.body;

        // تحديث الحقول مباشرة مع تفعيل التحقق من الموديل وإرجاع البيانات المحدثة
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...(name !== undefined && { doctorName: name }),
                    ...(specialty !== undefined && { specialty }),
                    ...(phone !== undefined && { phone }),
                    ...(email !== undefined && { email }),
                    ...(schedule !== undefined && { workingDays: schedule })
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: 'ملف الطبيب غير موجود لتعديله' });
        }

        return res.status(200).json({ success: true, message: 'تم تحديث بيانات الطبيب بنجاح' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'فشل في تحديث البيانات' });
    }
};

// ==================== 5. حذف ملف طبيب نهائياً من المنظومة (Delete) ====================
exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDoctor = await Doctor.findByIdAndDelete(id);

        if (!deletedDoctor) {
            return res.status(404).json({ success: false, message: 'ملف الطبيب غير موجود بالفعل' });
        }

        return res.status(200).json({ success: true, message: 'تم إزالة سجل الطبيب نهائياً من النظام' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'فشل إجراء حذف الطبيب من السيرفر' });
    }
};