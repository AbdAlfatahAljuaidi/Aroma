import React from 'react'
import { FaCoffee } from "react-icons/fa";
import { IoFlash } from "react-icons/io5";

const HeroContent = () => {
  return (
    <div className='md:flex items-center h-screen bg-black md:w-[50%]'>
      <div className='mx-10 text-white'>
        
        <div className='flex items-center pt-16'>
          <h1 className='bg-amber-800 px-4 py-3 rounded-xl'>
            <FaCoffee className='text-xl' />
          </h1>
          <h1 className='mr-2 font-bold text-2xl'>أروما</h1>
        </div>

        <h2 className='font-bold text-4xl mt-24 md:mt-5'>
          اصنع تجربة قهوة <br /> استثنائية بكل احترافية
        </h2>

        <p className='text-gray-500 mt-4 text-lg pl-24'>
          النظام المتكامل لإدارة المقاهي الحديثة. تتبع المخزون، أدر الطلبات،
          وراقب المبيعات والتحليلات في واجهة واحدة أنيقة وسهلة الاستخدام.
        </p>

        <section className='md:flex justify-around items-center'>
          
          <div>
            <div className='border border-gray-200 w-fit px-2 py-1 mt-8 text-amber-800 rounded-lg'>
              <IoFlash />
            </div>

            <h1 className='mt-3'>نقطة بيع فائقة السرعة</h1>
            <p className='text-gray-400 mt-1'>
              عالج الطلبات فوراً من خلال واجهة لمس سهلة وسريعة مصممة لتوفير الوقت.
            </p>
          </div>

          <div>
            <div className='border border-gray-200 w-fit px-2 py-1 mt-8 text-amber-800 rounded-lg'>
              <IoFlash />
            </div>

            <h1 className='mt-3'>إدارة ذكية للمخزون</h1>
            <p className='text-gray-400 mt-1'>
              راقب المواد الخام والكميات المتبقية وتنبيهات النقص بشكل فوري ودقيق.
            </p>
          </div>

        </section>
      </div>
    </div>
  )
}

export default HeroContent