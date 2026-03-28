import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const Invoice = () => {

  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const printRef = useRef()

  // ✅ جلب الطلب
  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await axios.get(`${apiUrl}/getOrder/${id}`)
        setOrder(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    getOrder()
  }, [id])

  // ✅ طباعة
  const handlePrint = () => {
    window.print()
  }

  if (!order) return <p className="p-10 text-center">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* زر الطباعة */}
      <div className="max-w-4xl mx-auto mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-primary text-white px-6 py-2 rounded-lg shadow hover:opacity-90"
        >
          🖨️ طباعة الفاتورة
        </button>
      </div>

      {/* الفاتورة */}
      <div ref={printRef} className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-primary">Invoice</h1>
            <p className="text-gray-500 mt-1">#{order.orderID}</p>
          </div>

          <div className="text-right">
            <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-500">{order.employeeName}</p>
          </div>
        </div>

        {/* CLIENT */}
        <div className="mb-8">
          <p className="text-gray-500">Bill To:</p>
          <p className="text-xl font-bold">{order.clientName}</p>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 font-semibold">المنتج</th>
                <th className="p-4 font-semibold text-right">السعر</th>
              </tr>
            </thead>

            <tbody>
              {order.order.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4 text-right">${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS */}
        <div className="mt-8 flex justify-end">
          <div className="w-72 space-y-3">

            <div className="flex justify-between text-gray-600">
              <span>المجموع</span>
              <span>${order.TotalBD}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>الخصم</span>
              <span>${order.Discount}</span>
            </div>

            <div className="flex justify-between text-xl font-bold text-primary border-t pt-3">
              <span>الإجمالي</span>
              <span>${order.Total}</span>
            </div>

          </div>
        </div>

        {/* PAYMENT */}
        <div className="mt-10 flex justify-between items-center">
          <span className="text-gray-500">طريقة الدفع:</span>
          <span className="px-4 py-2 bg-green-100 text-green-600 rounded-lg font-semibold">
            {order.Type}
          </span>
        </div>

        {/* FOOTER */}
        <div className="mt-10 border-t pt-6 text-center text-gray-400 text-sm">
          شكراً لتعاملكم معنا ❤️
        </div>

      </div>

      {/* CSS للطباعة */}
      <style>
        {`
          @media print {
            body {
              background: white;
            }
            .print\\:hidden {
              display: none;
            }
          }
        `}
      </style>

    </div>
  )
}

export default Invoice