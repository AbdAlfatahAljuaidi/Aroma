// productController.js
const Product = require("../models/productsModel");

// جلب كل المنتجات
const getProducts = async (req, res) => {
  try {
  
    
    const products = await Product.find(); // ✅ CommonJS
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// إنشاء منتج جديد
const createProduct = async (req, res) => {
  try {
    const { name, price, type, cost } = req.body;
    const image = req.file?.path;

    if (!name || !price || !type || !cost || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({ name, price, type, cost, image });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, createProduct }; // ✅ التصدير بصيغة CommonJS