import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const Orders = () => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
  // ✅ جلب البيانات من الباك
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${apiUrl}/getorders`)
      console.log(res.data);
      
      setOrders(res.data.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

    fetchOrders()
  }, [])

  return (
    <div className="bg-gray-50/20 min-h-screen">
      <h1 className="px-8 py-6 text-3xl font-bold bg-white shadow-sm">
        الطلبات
      </h1>

      <div className="p-8">

        <div className="mb-6">
          <p className="text-2xl font-bold">تاريخ الطلبات</p>
          <p className="text-primary text-lg mt-1">
            عرض جميع الطلبات
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          {loading ? (
            <p className="p-6 text-center">Loading...</p>
          ) : (

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">

                <thead className="bg-gray-50 border-b">
                  <tr className="text-gray-600">
                    <th className="p-4">رقم الطلب</th>
                    <th className="p-4">تاريخ الطلب</th>
                    <th className="p-4">الموظف</th>
                    <th className="p-4">العميل</th>
                    <th className="p-4">المجموع</th>
                    <th className="p-4">طريقة الدفع</th>
                    <th className="p-4">الفاتورة</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-50 transition duration-300"
                    >
                      <td className="p-4 font-medium">#{order.orderID}</td>

                      <td className="p-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">{order.employeeName}</td>

                      <td className="p-4">{order.clientName}</td>

                      <td className="p-4 text-primary font-semibold">
                        {order.Total}$
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-600">
                          {order.Type}
                        </span>
                      </td>

                      <td className="p-4">
                        <Link to={`/Invoice/${order._id}`}>
                          <button className="px-4 py-1 bg-primary text-white rounded-lg hover:opacity-90 transition">
                            عرض
                          </button>
                        </Link>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          )}
        </div>
      </div>
    </div>
  )
}

export default Orders