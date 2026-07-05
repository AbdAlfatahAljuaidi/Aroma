const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// مسارات إدارة الأطباء
router.post('/', doctorController.createDoctor);          // إنشاء طبيب جديد
router.get('/', doctorController.getAllDoctors);          // عرض كل الأطباء
router.get('/:id', doctorController.getDoctorById);       // عرض طبيب محدد
router.put('/:id', doctorController.updateDoctor);        // تعديل بيانات طبيب
router.delete('/:id', doctorController.deleteDoctor);     // حذف طبيب

module.exports = router;