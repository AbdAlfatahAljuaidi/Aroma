const express = require('express')
const router = express.Router()
const appointmentController = require('../controllers/appointments');

router.post('/bookAppointment', appointmentController.bookAppointment);
router.get('/bookAppointment', appointmentController.getAppointments);
router.put('/bookAppointment/:id', appointmentController.updateStatus);
router.put('/updateAppointment/:id', appointmentController.updateAppointment);
router.delete('/bookAppointment/:id', appointmentController.deleteAppointment);


module.exports = router;
