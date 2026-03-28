import React from 'react'
import SideMenu from '../Dashboard/SideMenu'
import { FaArrowRight, FaMoneyBill } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import {useNavigate} from 'react-router-dom'

const Invoice = () => {
  const navigate = useNavigate()
  return (
    
      <div>
        <div className="bg-gray-50/20 min-h-screen">

          {/* Header */}
          <h1 className="px-8 py-6 text-3xl font-bold bg-white shadow-sm ">
            الطلب
          </h1>

          <div className='mx-auto h-screen w-[70%] mt-10'>
            <p onClick={() => navigate(-1)} className='flex items-center text-primary/70 hover:text-primary transition-all duration-300 cursor-pointer text-right'> <FaArrowRight        className='ml-2' /> الرجوع الى الطلبات</p>
            <div className='flex justify-between items-center'>

              <p className='flex items-center mt-5 text-2xl'><FaMoneyBill className='ml-4' /> الطلب #00001</p>
              <button className='bg-green-100 text-green-500 px-9 py-2 rounded-md '>مكتمل</button>
            </div>

            <div className='flex justify-between gap-8'>
              <div className='mt-10 bg-white p-10 shadow w-full rounded-md'>
                <p className='font-bold text-2xl border-b'>العميل & الموظف</p>
                <div className='flex  items-center mt-5'>
<IoPerson className='text-3xl' />
                  <div className='text-xl mr-4'>
                    <p className='text-primary/60'>العميل</p>
                    <p>anas</p>

                  </div>

                </div>
                <div className='flex  items-center mt-5'>
<IoPerson className='text-3xl' />
                  <div className='text-xl mr-4'>
                    <p className='text-primary/60'>يُخدَم بواسطة</p>
                    <p>ali</p>

                  </div>

                </div>
              </div>
              <div className='mt-10 bg-white p-10 shadow w-full rounded-md '>
                <p className='font-bold text-2xl border-b'>معلومات الطلب</p>
                <div className='flex  items-center mt-5'>
<IoPerson className='text-3xl' />
                  <div className='text-xl mr-4'>
                    <p className='text-primary/60'>الوقت</p>
                    <p>2/2/2026</p>

                  </div>

                </div>
                <div className='flex  items-center mt-5'>
<IoPerson className='text-3xl' />
                  <div className='text-xl mr-4'>
                    <p className='text-primary/60'>طريقة الدفع</p>
                    <p>كاش</p>

                  </div>

                </div>

              </div>
            </div>

            <div className='shadow rounded-md mt-10 p-10  '>
              <h1 className=' text-2xl'>إيصال مفصل</h1>

              <table className='w-full text-right'>
                <tr className='bg-gray-50 '>
                  <th className='p-2'>dsadsa</th>
                  <th className='p-2'>dsadsa</th>
                  <th className='p-2'>dsadsa</th>
                  <th className='p-2'>dsadsa</th>
                  <th className='p-2'>dsadsa</th>
                </tr>

                <tr className='border-t bg-white '>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                </tr>

                <tr className='border-t bg-white '>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                </tr>
                <tr className='border-t bg-white '>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                </tr>


                <tr className='border-t bg-white '>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                  <td className='p-2'>sdasda</td>
                </tr>
              </table>
<div className='mt-8 text-lg'>
<p>المجموع قبل الخصم : 15.9$</p>
<p className='mt-3 text-green-500'>الخصم : 1.9$</p>
<div className='flex justify-between items-center'>
<p className='mt-3 border-t pt-2'>المجموع : <span className='text-primary'>14$</span></p>
<button className='bg-primary text-white rounded-md px-8 py-1 hover:cursor-pointer'>طباعة الفاتورة</button>
</div>

</div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Invoice