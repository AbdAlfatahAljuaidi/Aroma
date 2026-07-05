const express = require('express');
const router = express.Router();
const whatsappMessage = require('../controllers/whatsapp');



router.post('/whatsapp', whatsappMessage.sendWhatsapp);

module.exports = router;

