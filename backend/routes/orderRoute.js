const express = require("express")
const router = express.Router()

const orderController  = require("../controllers/orderController")

// ✅ GET all orders
router.get("/getOrders", orderController.getOrders)

// ✅ POST create order
router.post("/createOrder", orderController.createOrder)

router.get("/getOrder/:id", orderController.getSingleOrder)

module.exports = router