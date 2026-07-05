import React, { useState } from 'react'
import axios from 'axios' // ملاحظة: تأكد أنها import axios from 'axios' في مشروعك الفعلي
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa'

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const onchange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async () => {
    if (!formData.name || !formData.password) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setLoading(true); // هنا يتم تفعيل حالة التحميل

      const { data } = await axios.post(`${apiUrl}/Login`, formData)

      if (data.success === true || data.client === "false") {
        localStorage.setItem('employeeUser', JSON.stringify(data.user));
        
        if (data.token) {
          localStorage.setItem('employeeToken', data.token);
        }

        toast.success(data.message || "تم تسجيل الدخول بنجاح",{
          className: "!text-black !bg-white border border-teal-600",
          progressClassName: "!bg-teal-300",
        });
        navigate("/Dashboard");
      } 
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // هنا يتم إلغاء حالة التحميل بعد انتهاء الطلب
    }
  }

  return (
    <div className='bg-slate-50 min-h-screen flex justify-center items-center p-6' dir="rtl">
      
      <div className='bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-8 md:p-10 rounded-3xl max-w-md w-full transition-all duration-300'>
        
        <div className='text-center mb-8'>
          <div className='mx-auto bg-teal-50 text-teal-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-4'>
            <FaSignInAlt size={22} />
          </div>
          <h1 className='text-2xl font-black text-slate-800 tracking-tight'>تسجيل الدخول</h1>
          <p className='text-slate-400 text-xs mt-1.5 font-medium'>مرحباً بك مجدداً في لوحة التحكم الطبية</p>
        </div>

        <div className='space-y-4'>
          
          <div>
            <label className='block text-xs font-bold text-slate-600 mb-1.5'>اسم المستخدم</label>
            <div className='relative'>
              <span className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400'>
                <FaUser size={14} />
              </span>
              <input 
                onChange={onchange} 
                name="name" 
                type="text" 
                placeholder='أدخل اسم المستخدم' 
                className='w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors' 
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-xs font-bold text-slate-600 mb-1.5'>كلمة المرور</label>
            <div className='relative'>
              <span className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400'>
                <FaLock size={14} />
              </span>
              <input 
                onChange={onchange} 
                name="password" 
                type="password" 
                placeholder='أدخل كلمة المرور' 
                className='w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors' 
                required
              />
            </div>
          </div>

        </div>

        {/* ===== التعديل هنا في زر تسجيل الدخول ===== */}
        <button 
          onClick={handleLogin} 
          disabled={loading} // يمنع الكبس على الزر إذا كانت القيمة true
          className={`w-full mt-8 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2
            ${loading 
              ? 'bg-teal-400 cursor-not-allowed opacity-80' 
              : 'bg-teal-500 shadow-lg shadow-teal-500/20 hover:bg-teal-600 active:scale-[0.99] cursor-pointer'
            }`}
        >
          {loading ? (
            <>
              {/* شكل أنيميشن التحميل (Spinner) باستخدام Tailwind */}
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>جاري تسجيل الدخول...</span>
            </>
          ) : (
            'تسجيل الدخول'
          )}
        </button>

        <div className='mt-6 text-center border-t border-slate-100 pt-4'>
          <span className='text-xs text-slate-400 font-medium'> 
            ليس لديك حساب حساب حتى الآن؟ 
            <Link to={'/Signup'} className='text-teal-600 font-bold hover:underline mr-1'> 
              تسجيل حساب جديد
            </Link> 
          </span>
        </div>

      </div>
    </div>
  )
}

export default Login