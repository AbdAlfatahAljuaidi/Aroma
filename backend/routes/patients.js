const express = require('express');
const router = express.Router();
const { createPatient,getAllPatients,deletePatient,updatePatient ,getPatientById} = require('../controllers/patients');

router.post('/patients', createPatient);
router.get('/patients', getAllPatients);
router.delete('/patients/:id', deletePatient);
router.put('/patients/:id', updatePatient);
router.get('/patients/:id', getPatientById);

module.exports = router;