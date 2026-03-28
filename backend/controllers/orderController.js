const Order  = require("../models/orderModel")


// @desc    Get all orders
// @route   GET /getOrders
// @access  Public

exports.getOrders = async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 })
  
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      })
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching orders",
        error: error.message
      })
    }
  }


  // @desc    Create new order
// @route   POST /createOrders
// @access  Public


exports.createOrder = async (req, res) => {
  try {
    const {
      orderID,
      clientName,
      order,
      employeeName,
      TotalBD,
      Discount,
      Total,
      Type
    } = req.body

    // ✅ التحقق من الحقول الأساسية
    if (
      !orderID ||
      !clientName ||
      !employeeName ||
      !Type ||
      order.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      })
    }

    // ✅ التحقق من عناصر الطلب
    for (let item of order) {
      if (!item.name || item.price == null) {
        return res.status(400).json({
          success: false,
          message: "Each order item must have name and price"
        })
      }
    }

    // ✅ حساب التوتال (أفضل من الاعتماد على الفرونت)
    const calculatedTotal = order.reduce((acc, item) => acc + item.price, 0)

    const finalTotal = calculatedTotal - (Discount || 0)

    const newOrder = await Order.create({
      orderID,
      clientName,
      order,
      employeeName,
      TotalBD: calculatedTotal,
      Discount: Discount || 0,
      Total: finalTotal,
      Type
    })

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message
    })
  }
}

// GET single order
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    res.status(200).json({
      success: true,
      data: order
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}