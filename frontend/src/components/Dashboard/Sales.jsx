import React, { useEffect, useState } from 'react'
import { FaCoffee, FaCreditCard, FaMoneyBillAlt } from "react-icons/fa";
import { GoScreenFull } from "react-icons/go";
import axios from 'axios';
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const Sales = () => {

  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [discount, setDiscount] = useState(0)
  const [paymentType, setPaymentType] = useState("Cash")

  // ✅ جلب المنتجات
  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/getProducts`)
        setProducts(data)
      } catch (error) {
        console.log(error)
      }
    }
    getProducts()
  }, [])

  // ✅ إضافة للسلة
  const addToCart = (product) => {
    setCart((prev) => [...prev, product])
  }

  // ✅ حساب التوتال
  const total = cart.reduce((acc, item) => acc + item.price, 0)
  const finalTotal = total - discount

  // ✅ إنشاء الطلب
  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      alert("السلة فارغة")
      return
    }

    try {
      const newOrder = {
        orderID: Date.now().toString(),
        clientName: "Ali",
        employeeName: "Alaa",
        Type: paymentType,
        Discount: discount,
        order: cart.map((item) => ({
          name: item.name,
          price: item.price
        }))
      }

      const res = await axios.post(
        `${apiUrl}/createOrder`,
        newOrder
      )

      console.log(res.data)

      // ✅ reset
      setCart([])
      setDiscount(0)

      alert("تم إنشاء الطلب ✅")

    } catch (error) {
      console.log(error)
      alert("في خطأ ❌")
    }
  }

  return (
    <div className="bg-gray-50/20 min-h-screen">
    <h1 className="px-4 sm:px-8 py-6 text-3xl font-bold bg-white shadow-sm">
      المبيعات
    </h1>
  
    <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6 p-4 sm:p-6">
  
      {/* RIGHT SIDE - PRODUCTS */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <p className="text-2xl font-bold mb-4 sm:mb-6">القائمة</p>
  
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 overflow-auto max-h-[500px]">
  
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white p-4 sm:p-6 rounded-3xl border shadow-sm hover:shadow-xl transition cursor-pointer text-center"
            >
              <div className="mb-2 sm:mb-4 flex justify-center text-3xl sm:text-4xl text-primary">
              <img src={product.image} alt="" className='h-36 w-full' />
              </div>
  
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-primary font-bold">${product.price}</p>
  
              <button
                onClick={() => addToCart(product)}
                className="mt-2 sm:mt-4 w-full bg-primary text-white py-2 rounded-lg"
              >
                إضافة للسلة
              </button>
            </div>
          ))}
  
        </div>
      </div>
  
      {/* LEFT SIDE - CART */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex flex-col justify-between">
  
        <div>
          <p className="text-2xl font-bold">الطلب الحالي</p>
  
          {cart.length === 0 ? (
            <div className="flex flex-col items-center text-gray-400 py-10">
              <GoScreenFull className="text-4xl mb-3" />
              <p>الطلب فارغ</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3 mt-4 max-h-[250px] overflow-auto">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* FOOTER */}
        <div className="border-t pt-4 sm:pt-6">
  
          <div className="flex justify-between mt-2 sm:mt-4">
            <p>المجموع</p>
            <span>{total}$</span>
          </div>
  
          <div className="flex justify-between items-center mt-2 sm:mt-4">
            <p>الخصم</p>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="border px-2 py-1 w-20 rounded"
            />
          </div>
  
          <div className="flex justify-between mt-4 sm:mt-6 text-xl font-bold text-primary">
            <p>المجموع الكلي</p>
            <span>{finalTotal}$</span>
          </div>
  
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
            <button
              onClick={() => setPaymentType("Cash")}
              className={`flex-1 py-2 rounded-lg border ${
                paymentType === "Cash" ? "bg-primary text-white" : ""
              }`}
            >
              <FaMoneyBillAlt className="inline mr-2" />
              Cash
            </button>
  
            <button
              onClick={() => setPaymentType("Card")}
              className={`flex-1 py-2 rounded-lg border ${
                paymentType === "Card" ? "bg-primary text-white" : ""
              }`}
            >
              <FaCreditCard className="inline mr-2" />
              Card
            </button>
          </div>
  
          <button
            onClick={handleCreateOrder}
            className="w-full mt-4 sm:mt-6 bg-primary text-white py-3 rounded-lg font-semibold"
          >
            اكمال الطلب
          </button>
  
        </div>
      </div>
  
    </div>
  </div>
  )
}

export default Sales