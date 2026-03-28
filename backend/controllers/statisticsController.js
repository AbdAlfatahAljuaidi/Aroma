const Order = require("../models/orderModel");

exports.getStatistics = async (req, res) => {
  try {
    const orders = await Order.find();

    // عدد الطلبات
    const totalOrders = orders.length;

    // مجموع المبيعات (بعد الخصم)
    const totalSales = orders.reduce(
      (acc, order) => acc + (order.Total || 0),
      0
    );

    const totalDiscount = orders.reduce(
        (acc, order) => acc + ((order.TotalBD || 0) - (order.Total || 0)),
        0
      );

    // عدد العملاء (unique)
    const uniqueCustomers = new Set(
      orders.map(order => order.clientName)
    );

    const totalCustomers = uniqueCustomers.size;

    res.json({
        totalOrders,
        totalSales,
        totalDiscount,
        totalCustomers
      });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};