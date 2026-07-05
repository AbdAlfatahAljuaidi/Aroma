const express = require('express');
const router = express.Router();
const { getAllEquipment, createEquipment } = require('../controllers/equipment');

// مسارات الأجهزة الطبية
router.get('/medical-equipment', getAllEquipment);
router.post('/medical-equipment', createEquipment);

module.exports = router;