const express = require('express');
const router = express.Router();
const { loginEmployee,logoutEmployee } = require('../controllers/login');

// مسار تسجيل الدخول المتوافق مع الفرونت إند
router.post('/Login', loginEmployee);
router.post('/Logout', logoutEmployee);

module.exports = router;