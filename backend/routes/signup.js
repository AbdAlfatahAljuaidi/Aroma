const express = require('express');
const router = express.Router();
const { registerEmployee } = require('../controllers/signup');

// مسار تسجيل حساب الموظف / الطبيب الجديد
router.post('/registerEmployee', registerEmployee);

module.exports = router;