import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; // استيراد التوجيه للانتقال بين الصفحات
import { FaCalendarPlus, FaStethoscope, FaFolder, FaClock, FaDollarSign } from 'react-icons/fa';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Book = () => {
  const navigate = useNavigate(); // دالة التنقل والتوجيه للوراء
  const [loading, setLoading] = useState(false);

  // حالات الـ Form (حقول الخدمة الجديدة)
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('أسنان عام');
  const [expectedTime, setExpectedTime] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [status, setStatus] = useState('قيد المراجعة');

  // دالة إضافة خدمة جديدة وإرسالها للباك-أند (POST) ثم العودة للخلف
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!serviceName || !expectedTime || !basePrice) return;

    try {
      setLoading(true);
      const payload = {
        serviceName,
        category,
        expectedTime,
        basePrice: Number(basePrice),
        status
      };

      // إرسال الطلب إلى الـ Controller بالخلفية
      const response = await axios.post(`${API_URL}/services`, payload);

      if (response.data.success) {
        // إعادة تهيئة الحقول بعد النجاح (اختياري)
        setServiceName('');
        setExpectedTime('');
        setBasePrice('');
        setStatus('قيد المراجعة');
        
                toast.success("تم اضافة خدمة جديدة بنجاح",{
                  className: "!text-black !bg-white border border-teal-600",
                  progressClassName: "!bg-teal-300",
                });
        
        // الانتقال فوراً إلى الصفحة السابقة بعد نجاح الرفع
        navigate(-1);
      }
    } catch (err) {
      console.error("خطأ في إضافة الخدمة:", err);
      toast.error("حدث خطأ أثناء حفظ الخدمة، يرجى المحاولة مرة أخرى.",{
        className: "!text-red-500 !bg-white border border-red-600",
        progressClassName: "!bg-red-300",

      }

      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-8 text-right" dir="rtl">
      
      {/* الهيدر العلوي */}
      <div className="mb-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FaCalendarPlus className="text-teal-600" /> إضافة خدمة طبية جديدة
        </h1>
        <p className="text-slate-400 text-sm mt-1">قم بتعبئة بيانات الخدمة الطبية بدقة ليتم إضافتها وتوفيرها بداخل النظام</p>
      </div>

      {/* نموذج إضافة خدمة جديدة (تم جعله ممركزاً وبحجم مناسب بعد حذف الجدول) */}
      <div className="max-w-2xl mx-auto bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100办公">معلومات الخدمة الجديدة</h3>
        
        <form onSubmit={handleAddService} className="space-y-5">
          {/* الإجراء / الخدمة الطبية */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">الإجراء / الخدمة الطبية</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <FaStethoscope size={14} />
              </span>
              <input 
                type="text" 
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="مثال: تبييض أسنان بالليزر"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                required
              />
            </div>
          </div>

          {/* التصنيف */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">التصنيف</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <FaFolder size={14} />
              </span>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 appearance-none"
              >
                <option value="أسنان عام">أسنان عام</option>
                <option value="علاج عصب">علاج عصب</option>
                <option value="تقويم وأسنان تجميلية">تقويم وأسنان تجميلية</option>
                <option value="جراحة وزراعة">جراحة وزراعة</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* الوقت المتوقع على الكرسي */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">الوقت المتوقع على الكرسي</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <FaClock size={14} />
                </span>
                <input 
                  type="text" 
                  value={expectedTime}
                  onChange={(e) => setExpectedTime(e.target.value)}
                  placeholder="مثال: 45 دقيقة"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>

            {/* السعر الأساسي */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">السعر الأساسي</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <FaDollarSign size={14} />
                </span>
                <input 
                  type="number" 
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="مثال: 250"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* الحالة البدئية للخدمة */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">الحالة</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500"
            >
              <option value="قيد المراجعة">⏳ قيد المراجعة</option>
              <option value="نشط">✅ نشط</option>
            </select>
          </div>

          {/* أزرار التحكم والعمليات */}
          <div className="flex gap-3 pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-teal-50"
            >
              {loading ? "جاري الحفظ والرفع..." : "حفظ وإضافة الخدمة"}
            </button>
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              إلغاء وعودة
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Book;