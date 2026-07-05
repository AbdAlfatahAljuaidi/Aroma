const express = require('express')
const router = express.Router()
const {createFinancialRecord , getFinancialRecords} = require('../controllers/financials');

router.post('/createPayment', createFinancialRecord);
router.post('/getFinancialRecords', getFinancialRecords);


module.exports = router;
