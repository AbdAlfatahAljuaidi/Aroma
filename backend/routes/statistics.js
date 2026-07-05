const express = require('express');
const router = express.Router();
const { getClinicStatistics } = require('../controllers/stats');

// مسار استدعاء البيانات التجميعية للوحة التحكم
router.get('/statistics', getClinicStatistics);

module.exports = router;