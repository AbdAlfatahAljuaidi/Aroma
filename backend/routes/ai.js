const express = require('express');
const router = express.Router();
const { analyzePatientChat } = require('../controllers/ai');

// مسار إرسال استفسار طبي وتحليل بيانات مريض محدد
router.post('/analyze', analyzePatientChat);

module.exports = router;