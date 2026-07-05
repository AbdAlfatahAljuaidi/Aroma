const express = require('express');
const router = express.Router();
const { getAllSupplies, createSupply,updateSupply,deleteSupply } = require('../controllers/medicalSupplies');

// المسارات الخاصة بالمستلزمات
router.get('/supplies', getAllSupplies);
router.post('/supplies', createSupply);
router.put('/supplies/:id', updateSupply);
router.delete('/supplies/:id', deleteSupply);

module.exports = router;