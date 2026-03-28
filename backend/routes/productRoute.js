// productRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../config/multer"); // حسب مكان ملف multer
const { getProducts, createProduct } = require("../controllers/productController");

// GET جميع المنتجات
router.get("/getProducts", getProducts);

// POST إنشاء منتج جديد مع رفع صورة
router.post("/createProduct", upload.single("image"), createProduct);

module.exports = router;