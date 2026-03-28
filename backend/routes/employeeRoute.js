const EmployeeController = require("../controllers/employeeController")
const express = require('express')
const router = express.Router()

router.post("/registerEmployee",EmployeeController.Signup )

module.exports = router