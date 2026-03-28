import React from 'react'
import { Link } from 'react-router-dom'

const ActionSection = () => {
  return (
    <div className='md:flex items-center mx-10 md:w-[50%] py-10'>
      <div className='shadow-md p-10 mx-auto rounded-xl'>
        <div className='w-full'>
          <h1 className='mx-auto w-fit text-2xl'>مرحباً بعودتك</h1>
          <h2 className='text-gray-400 mx-auto w-fit'>
            سجّل الدخول إلى حسابك للمتابعة
          </h2>

          <div className='flex justify-center items-center  '>
            <Link className='w-full' to="/Login">
              <button
                className="bg-amber-800 text-white px-5 w-full py-3 mt-5 rounded-lg 
                hover:bg-amber-900 
                hover:scale-105 
                hover:shadow-lg 
                transition-all duration-300 
                cursor-pointer"
              >
                تسجيل الدخول
              </button>
            </Link>
          </div>

          <p className='text-gray-400 mx-auto w-fit mt-5 text-sm'>
            بالمتابعة، فإنك توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بنا.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ActionSection