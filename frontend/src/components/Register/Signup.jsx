import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaUser, FaLock, FaUserPlus } from 'react-icons/fa'

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    systemPassword:"",
  })
  
  // حالة لإدارة مؤشر التحميل أثناء إرسال البيانات للباك إند
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignup = async () => {
    // 1. التحقق المبدئي من ملء الحقول وتطابق كلمة المرور
    if (!formData.name || !formData.password || !formData.confirmPassword) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمات المرور غير متطابقة!");
      return;
    }

    try {
      setLoading(true); // تفعيل مؤشر التحميل وتجميد الزر

      // 2. إرسال البيانات مباشرة إلى الـ API بعد ربطه ببادئة الـ /api والمسار المخصص
      const { data } = await axios.post(`${apiUrl}/registerEmployee`, formData)
      
      if (data.error === false || data.success === true) {
        toast.success(data.message || "تم تسجيل الحساب بنجاح!",{
          className: "!text-black !bg-white border border-teal-600",
          progressClassName: "!bg-teal-300",
        })

      
        navigate("/Login")
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "حدث خطأ أثناء تسجيل الحساب";
      toast.error(errorMessage)
    } finally {
      setLoading(false); // إلغاء تفعيل مؤشر التحميل بعد انتهاء الطلب
    }
  }

  return (
    <div className='bg-slate-50 min-h-screen flex justify-center items-center p-6' dir="rtl">
      
      {/* كارد إنشاء الحساب الاحترافي بالنظام */}
      <div className='bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-8 md:p-10 rounded-3xl max-w-md w-full transition-all duration-300'>
        
        {/* الهيدر والعنوان الإداري */}
        <div className='text-center mb-8'>
          <div className='mx-auto bg-teal-50 text-teal-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-4'>
            <FaUserPlus size={22} />
          </div>
          <h1 className='text-2xl font-black text-slate-800 tracking-tight'>تسجيل حساب جديد</h1>
          <p className='text-slate-400 text-xs mt-1.5 font-medium'>قم بإنشاء حساب موظف للوصول إلى لوحة العيادة</p>
        </div>

        {/* الحقول المحددة الثلاثة */}
        <div className='space-y-4'>
          
          {/* حقل اسم المستخدم */}
          <div>
            <label className='block text-xs font-bold text-slate-600 mb-1.5'>اسم الموظف / الطبيب</label>
            <div className='relative'>
              <span className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400'>
                <FaUser size={14} />
              </span>
              <input 
                onChange={onChange} 
                name="name" 
                type="text" 
                placeholder='أدخل الاسم الكامل' 
                className='w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors' 
                required
              />
            </div>
          </div>

          {/* حقل كلمة المرور */}
          <div>
            <label className='block text-xs font-bold text-slate-600 mb-1.5'>كلمة المرور</label>
            <div className='relative'>
              <span className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400'>
                <FaLock size={14} />
              </span>
              <input 
                onChange={onChange} 
                name="password" 
                type="password" 
                placeholder='أدخل كلمة المرور' 
                className='w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors' 
                required
              />
            </div>
          </div>

          {/* حقل تأكيد كلمة المرور */}
          <div>
            <label className='block text-xs font-bold text-slate-600 mb-1.5'>تأكيد كلمة المرور</label>
            <div className='relative'>
              <span className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400'>
                <FaLock size={14} />
              </span>
              <input 
                onChange={onChange} 
                name="confirmPassword" 
                type="password" 
                placeholder='أعد كتابة كلمة المرور للـتأكيد' 
                className='w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors' 
                required
              />
            </div>
          </div>


          <div>
            <label className='block text-xs font-bold text-slate-600 mb-1.5'> كلمة المرور النظام</label>
            <div className='relative'>
              <span className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400'>
                <FaLock size={14} />
              </span>
              <input 
                onChange={onChange} 
                name="systemPassword" 
                type="password" 
                placeholder=' كتابة كلمة المرور الخاصة بالنظام' 
                className='w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors' 
                required
              />
            </div>
          </div>

        </div>

        {/* زر التسجيل باللون الرئيسي مع تعطيله أثناء الـ Loading */}
        <button 
          onClick={handleSignup} 
          disabled={loading}
          className='w-full mt-8 bg-teal-500 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-teal-500/20 hover:bg-teal-600 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب وتفعيل الدخول"}
        </button>

        {/* رابط الدخول إذا كان يمتلك حساباً */}
        <div className='mt-6 text-center border-t border-slate-100 pt-4'>
          <span className='text-xs text-slate-400 font-medium'> 
            هل لديك حساب بالفعل؟ 
            <Link to={'/Login'} className='text-teal-600 font-bold hover:underline mr-1'> 
              تسجيل الدخول
            </Link> 
          </span>
        </div>

      </div>
    </div>
  )
}

export default Signup