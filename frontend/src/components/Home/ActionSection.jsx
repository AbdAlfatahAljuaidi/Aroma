import React from 'react'
import { Link } from 'react-router-dom'
import { FaKey } from 'react-icons/fa'

const ActionSection = () => {
  return (
    <div className='md:flex items-center justify-center bg-slate-50 md:w-[50%] px-8 py-12' dir="rtl">
      
      {/* كارد أبيض ناصع، نظيف وواضح بدون تعقيد ألوان بالخلفية */}
      <div className='bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-8 md:p-10 mx-auto rounded-3xl max-w-md w-full transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/80 group'>
        <div className='w-full text-center'>
          
          {/* الأيقونة الطبية بلون تيل مريح وخلفية ناعمة */}
          <div className='mx-auto bg-teal-50 text-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-teal-100/50 group-hover:scale-105 transition-transform duration-300'>
            <FaKey size={20} />
          </div>

          {/* نصوص واضحة وعميقة وبدون تدرجات صعبة القراءة */}
          <h1 className='mx-auto w-fit text-2xl font-black text-slate-800 tracking-tight'>
            نظام إدارة العيادة الذكي
          </h1>
          <h2 className='text-slate-400 mx-auto w-fit text-sm mt-2.5 max-w-[290px] leading-relaxed font-medium'>
            الرجاء تسجيل الدخول للوصول الآمن إلى لوحة التحكم والمواعيد وجداول المرضى.
          </h2>

          {/* زر صريح وواضح باللون الرئيسي المطلق bg-teal-500 */}
          <div className='flex justify-center items-center mt-8'>
            <Link className='w-full' to="/Login">
              <button
                className="w-full bg-teal-500 text-white font-bold px-5 py-3.5 rounded-xl
                hover:bg-teal-600
                hover:shadow-lg hover:shadow-teal-500/20 
                active:scale-[0.99]
                transition-all duration-200 
                cursor-pointer text-sm tracking-wide"
              >
                الدخول إلى لوحة التحكم
              </button>
            </Link>
          </div>

          {/* تذييل ناعم وبسيط */}
          <p className='text-slate-400 mx-auto w-fit mt-8 text-xs leading-normal border-t border-slate-100 pt-5 w-full font-normal'>
            بوابتك محمية بالكامل؛ هذا النظام مخصص للموظفين والأطباء المصرح لهم فقط.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ActionSection