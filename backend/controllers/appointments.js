const Appointment = require('../models/Appointment'); // استدعاء موديل المواعيد لـ MongoDB

// ==================== أ. إضافة موعد جديد (POST) ====================
exports.bookAppointment = async (req, res) => {
  try {
    console.log("Incoming booking data:", req.body);
    const { patientName, doctor, service, time, appointmentDate, appointmentDay, status } = req.body;

    if (!patientName || !doctor || !service || !time || !appointmentDate || !appointmentDay) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    // بناء كائن الموعد الجديد بناءً على هيكلية المدخلات الحالية
    const appointmentData = new Appointment({
      patientName,
      doctorName: doctor, // ربط الحقل القادم بالموديل
      treatment: service, // ربط حقل الخدمة بحقل الإجراء الطبي في الموديل
      appointmentDate,
      appointmentDay,
      appointmentTime: time, // ربط الوقت
      status: status || 'pending' 
    });

    await appointmentData.save();
    
    // إرجاع النتيجة مطابقة للشكل الذي يتوقعه الفرونت إند
    return res.status(201).json({ 
      id: appointmentData._id, 
      patientName: appointmentData.patientName,
      doctor: appointmentData.doctorName,
      service: appointmentData.treatment,
      appointmentDate: appointmentData.appointmentDate,
      appointmentDay: appointmentData.appointmentDay,
      time: appointmentData.appointmentTime,
      status: appointmentData.status
    });

  } catch (error) {
    console.error("MongoDB Error:", error);
    return res.status(500).json({ error: 'Failed to book appointment' });
  }
};

// ==================== ب. جلب جميع المواعيد (GET) ====================
exports.getAppointments = async (req, res) => {
  try {
    // جلب المواعيد وترتيبها بالأحدث أولاً
    const appointmentData = await Appointment.find().sort({ createdAt: -1 });
    
    // تحويل البيانات لتناسب حقول جدول الـ React أو الـ Vue المستخدم بالخارج
    const appointments = appointmentData.map(doc => ({
      id: doc._id, 
      patientName: doc.patientName,
      doctor: doc.doctorName,
      service: doc.treatment,
      appointmentDate: doc.appointmentDate,
      appointmentDay: doc.appointmentDay,
      time: doc.appointmentTime,
      status: doc.status
    }));

    return res.status(200).json(appointments);
  } catch (error) {
    console.error("MongoDB Error:", error);
    return res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// ==================== ج. تحديث حالة الموعد فقط (PUT) ====================
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedApp = await Appointment.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updatedApp) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    return res.status(200).json({ message: 'Status updated successfully', success: true });
  } catch (error) {
    console.error("MongoDB Error:", error);
    return res.status(500).json({ error: 'Failed to update status' });
  }
};

// ==================== د. تحديث بيانات الموعد بالكامل (PUT) ====================
exports.updateAppointment = async (req, res) => {
  try {
    console.log("Updating appointment with data:", req.body);
    
    const { id } = req.params;
    const { patientName, doctor, service, time, appointmentDate, appointmentDay, status } = req.body;

    if (!patientName || !doctor || !service || !time || !appointmentDate || !appointmentDay) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة لتحديث الموعد' });
    }

    // بناء البيانات المحدثة مع الحفاظ على التسميات الخاصة بـ MongoDB
    const updatedFields = {
      patientName,
      doctorName: doctor,
      treatment: service,
      appointmentDate,
      appointmentDay,
      appointmentTime: time,
      status: status || 'pending'
    };

    const updatedApp = await Appointment.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!updatedApp) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Appointment updated successfully',
      id: updatedApp._id,
      patientName,
      doctor,
      service,
      appointmentDate,
      appointmentDay,
      time,
      status: updatedApp.status
    });
  } catch (error) {
    console.error("MongoDB Error during update:", error);
    return res.status(500).json({ error: 'Failed to update appointment' });
  }
};

// ==================== هـ. حذف الموعد نهائياً (DELETE) ====================
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedApp = await Appointment.findByIdAndDelete(id);
    
    if (!deletedApp) {
      return res.status(404).json({ error: 'Appointment not found or already deleted' });
    }

    return res.status(200).json({ 
      success: true,
      message: 'Appointment deleted successfully',
      id 
    });
  } catch (error) {
    console.error("MongoDB Error during delete:", error);
    return res.status(500).json({ error: 'Failed to delete appointment' });
  }
};