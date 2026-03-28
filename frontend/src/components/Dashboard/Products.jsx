import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب المنتجات من السيرفر
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/getProducts`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50/20 min-h-screen">
      <h1 className="px-8 py-6 text-3xl font-bold bg-white shadow-sm">
        الطلبات
      </h1>

      <div className="p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">قائمة المنتجات</p>
            <p className="text-primary text-lg mt-1">إدارة عروض مقهاك</p>
          </div>
          <Link to="/AddProducts">
            <button className="text-white bg-primary px-9 py-1 rounded-md hover:scale-105 transition-all duration-300">
              اضافة منتجات
            </button>
          </Link>
        </div>

        {loading ? (
          <p>جاري التحميل...</p>
        ) : (
          <div className="md:grid grid-cols-5 gap-5 mt-10">
            {products.map((product) => {
              const profitPercent = Math.round(
                ((product.price - product.cost) / product.cost) * 100
              );
              return (
                <div
                  key={product._id}
                  className="rounded-xl overflow-hidden relative"
                >
                  <div className="absolute top-2 bg-green-200 rounded-md right-2">
                    <p className="text-green-500 px-4">مفعل</p>
                  </div>

                  <img
                    className="object-cover w-full h-40"
                    src={product.image}
                    alt={product.name}
                  />

                  <div className="flex justify-between py-4 bg-white px-4">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-primary/50">{product.type}</p>
                    </div>
                    <p className="text-primary">{product.price} JD</p>
                  </div>

                  <div className="border border-gray-100 px-4 flex justify-between items-center bg-white py-4">
                    <p>التكلفة: {product.cost} JD</p>
                    <p className="text-green-500">الربح: {profitPercent}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;