import React from 'react'
import { FaMoneyBillAlt } from "react-icons/fa";

import {IoPerson } from "react-icons/io5";
import Charts from './Charts';

const Statistics = () => {
  return (
    <div className='bg-gray-50/20'>
        <h1 className='p-6 text-2xl font-bold  shadow-md'> لوحة التحكم</h1>
        <div className='m-8'>
            <p className='text-2xl font-bold '>نظرة عامة على لوحة التحكم</p>
            <p className='text-amber-800 text-xl'>   إليك ما يحدث في مقهاك اليوم           </p>
        </div>
        <div className='md:grid grid-cols-4 px-8 gap-5'>
            <div className='shadow-md p-4'>
            <div className='flex justify-between items-center px-2'>
              <div>
              <h1>مجموع المبيعات</h1>
              <span className='font-bold text-2xl mt-2 block' >2000</span>
              </div>
              <FaMoneyBillAlt className='text-4xl text-amber-800' />
            </div>
            <p className='text-green-400 mt-3'> اعلى 12% من الشهر الماضي </p>
            </div>

            <div className='shadow-md p-4'>
            <div className='flex justify-between items-center px-2'>
              <div>
              <h1>صافي الربح</h1>
              <span className='font-bold text-2xl mt-2 block' >1500</span>
              </div>
              <FaMoneyBillAlt className='text-4xl text-amber-800' />
            </div>
            <p className='text-green-400 mt-3'> اعلى 12% من الشهر الماضي </p>
            </div>

            <div className='shadow-md p-4'>
            <div className='flex justify-between items-center px-2'>
              <div>
              <h1>عدد العملاء</h1>
              <span className='font-bold text-2xl mt-2 block' >168</span>
              </div>
              <IoPerson className='text-4xl text-amber-800' />
            </div>
            <p className='text-green-400 mt-3'> اعلى 12% من الشهر الماضي </p>
            </div>

            <div className='shadow-md p-4'>
            <div className='flex justify-between items-center px-2'>
              <div>
              <h1>عدد الموظفين</h1>
              <span className='font-bold text-2xl mt-2 block' >5</span>
              </div>
              <IoPerson className='text-4xl text-amber-800' />
            </div>
            <p className='text-green-400 mt-3'> اعلى 12% من الشهر الماضي </p>
            </div>
        

        </div>

        <Charts />
    </div>
  )
}

export default Statistics