const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

const Order = require("../models/orderModel");
const Product = require("../models/productsModel");
const Inventory = require("../models/inventoryModel");
const Material = require("../models/materialModel");

dotenv.config();

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

exports.AI = async (req, res) => {
  try {
    // =========================
    // 📦 1. جلب البيانات
    // =========================
    const orders = await Order.find();
    const products = await Product.find();
    const inventory = await Inventory.find();
    const materials = await Material.find();

    // =========================
    // 📊 2. حساب الإحصائيات
    // =========================

    // Orders
    const totalOrders = orders.length;

    const totalSales = orders.reduce(
      (acc, order) => acc + (order.Total || 0),
      0
    );

    const totalDiscount = orders.reduce(
      (acc, order) => acc + ((order.TotalBD || 0) - (order.Total || 0)),
      0
    );

    const uniqueCustomers = new Set(
      orders.map(order => order.clientName)
    );

    const totalCustomers = uniqueCustomers.size;

    const avgOrderValue =
      totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

    // Products
    const totalProducts = products.length;

    const totalProductPrices = products.reduce(
      (acc, p) => acc + (p.price || 0),
      0
    );

    const avgProductPrice =
      totalProducts > 0
        ? (totalProductPrices / totalProducts).toFixed(2)
        : 0;

    // Inventory
    const totalInventoryItems = inventory.length;

    const totalStock = inventory.reduce(
      (acc, item) => acc + (item.quantity || 0),
      0
    );

    // Materials
    const totalMaterials = materials.length;

    const totalMaterialStock = materials.reduce(
      (acc, m) => acc + (m.quantity || 0),
      0
    );

    // =========================
    // 🧾 3. تجهيز Summary
    // =========================
    const summary = `
    الطلبات:
    - عدد الطلبات: ${totalOrders}
    - مجموع المبيعات: ${totalSales}
    - متوسط الطلب: ${avgOrderValue}
    - إجمالي الخصومات: ${totalDiscount}
    - عدد العملاء: ${totalCustomers}

    المنتجات:
    - عدد المنتجات: ${totalProducts}
    - متوسط سعر المنتج: ${avgProductPrice}

    المخزون:
    - عدد عناصر المخزون: ${totalInventoryItems}
    - إجمالي الكمية: ${totalStock}

    المواد الخام:
    - عدد المواد: ${totalMaterials}
    - إجمالي الكمية: ${totalMaterialStock}
    `;

    // =========================
    // 🤖 4. إرسال للـ AI
    // =========================
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      لديك بيانات كاملة عن كافيه:

      ${summary}

      اعطني تحليل ذكي للأداء.
      اعطني نصائح لتحسين المبيعات والإدارة.
      اعطني أشياء يجب تجنبها للحفاظ على النجاح.

      الشروط:
      - 3 فقرات فقط
      - بدون ترقيم
      - كل فقرة قصيرة
      - بأسلوب عملي وواضح
      `
    });

    res.status(200).json({
      error: false,
      text: response.text
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true });
  }
};