const inventoryController = require('../controllers/inventoryController')
const express = require('express')
const router = express.Router()

router.get("/getInventory", inventoryController.getInventory)
router.post("/addInventory", inventoryController.addInventory)
router.delete("/deleteInventory/:id" , inventoryController.deleteInventory)

module.exports = router