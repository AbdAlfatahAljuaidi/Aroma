const express = require('express');
const router = express.Router();
const { getAllServices, createService,deleteService,updateService } = require('../controllers/services');

// مسار جلب الخدمات: GET /api/services
router.get('/services', getAllServices);

// مسار إضافة خدمة: POST /api/services
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

module.exports = router;