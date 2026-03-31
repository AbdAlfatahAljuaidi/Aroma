import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Orders = () => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ فلترة
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${apiUrl}/getorders`)
        setOrders(res.data.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // ✅ فلترة البيانات
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      order.employeeName?.toLowerCase().includes(search.toLowerCase())

    const matchesDate = dateFilter
      ? new Date(order.createdAt).toLocaleDateString() ===
        new Date(dateFilter).toLocaleDateString()
      : true

    return matchesSearch && matchesDate
  })

  // ✅ مجموع الطلبات
  const totalOrders = filteredOrders.length

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

        {/* ✅ الفلاتر */}
        <div className="flex flex-wrap gap-4 mb-6">

          <input
            type="text"
            placeholder="ابحث باسم العميل أو الموظف"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg w-full md:w-1/3"
          />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border p-2 rounded-lg"
          />

        </div>

        {/* ✅ مجموع الطلبات */}
        <div className="flex gap-6 mb-4">

<div className="bg-white shadow rounded-xl px-4 py-2 flex items-center gap-3">
  <p className="text-gray-500 text-sm">عدد الطلبات</p>
  <p className="text-2xl font-bold text-primary">{totalOrders}</p>
</div>

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
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center p-6 text-gray-500">
                        لا يوجد نتائج
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
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
                    ))
                  )}
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