const clientController = require("../controllers/clientController")
const express = require("express")
const router = express.Router()


router.post("/Signup",clientController.Signup)
router.post("/Login", clientController.Login)
router.get("/getClients", clientController.getClients)

module.exports = router