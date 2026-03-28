const aiController = require("../controllers/aiController")
const express = require("express")
const router = express.Router()


router.post("/ai",aiController.AI)

module.exports = router