// productsModel.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    cost: { type: Number, required: true },
    image: { type: String, required: true }, // رابط الصورة
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product; // ✅ التصدير بصيغة CommonJS