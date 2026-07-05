import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeartbeat, FaMapMarkerAlt, FaCalendarCheck, FaToggleOn, FaArrowRight, FaPlus } from 'react-icons/fa';
import axios from 'axios';


const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const AddEquipment = () => {
  const navigate = useNavigate();

  // حالات إدارة المدخلات (Form State)
  const [formData, setFormData] = useState({
    equipmentName: '',
    location: '',
    lastMaintenance: '',
    nextMaintenance: '',
    status: 'يعمل بكفاءة' // قيمة تشغيلية افتراضية
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // تحديث البيانات عند الكتابة في الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // إرسال البيانات إلى الباك-أند
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.equipmentName || !formData.location || !formData.nextMaintenance) {
      setError("يرجى ملء الحقول الأساسية (اسم الجهاز، الموقع، وتاريخ الفحص القادم).");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/medical-equipment`, formData);

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(-1); // التوجيه لصفحة عرض الأجهزة الرئيسية
        }, 1500);
      }
    } catch (err) {
      console.error("حدث خطأ أثناء إضافة الجهاز:", err);
      setError(err.response?.data?.message || "فشل الاتصال بالسيرفر، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-10 text-right" dir="rtl">
      {/* الهيدر العلوي */}
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إضافة جهاز طبي جديد</h1>
          <p className="text-slate-400 text-sm mt-1">تسجيل الأجهزة الطبية في العيادة وجدولة مواعيد فحص الصيانة الدورية</p>
        </div>
        <Link to="/MedicalEquipment">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
            <FaArrowRight size={12} /> العودة للأجهزة
          </button>
        </Link>
      </div>

      {/* النموذج Form */}
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-sm font-medium">
              تمت إضافة الجهاز بنجاح! جاري التوجيه إلى قائمة الأجهزة...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* اسم الجهاز الطبي */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">اسم الجهاز الطبي <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  name="equipmentName"
                  value={formData.equipmentName}
                  onChange={handleChange}
                  placeholder="مثال: جهاز الأشعة السينية (X-Ray)، كرسي الأسنان الرئيسي"
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm transition-all"
                />
                <FaHeartbeat className="absolute top-3.5 right-3.5 text-slate-400" />
              </div>
            </div>

            {/* موقع التواجد */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">موقع التواجد داخل العيادة <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="مثال: العيادة A، غرفة الأشعة، المعمل"
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm transition-all"
                />
                <FaMapMarkerAlt className="absolute top-3.5 right-3.5 text-slate-400" />
              </div>
            </div>

            {/* التواريخ (آخر صيانة والفحص القادم) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* تاريخ آخر صيانة */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">تاريخ آخر صيانة</label>
                <input
                  type="date"
                  name="lastMaintenance"
                  value={formData.lastMaintenance}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm transition-all text-right"
                />
              </div>

              {/* الفحص الدوري القادم */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">الفحص الدوري القادم <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  name="nextMaintenance"
                  value={formData.nextMaintenance}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm transition-all text-right"
                />
              </div>
            </div>

            {/* الحالة التشغيلية */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">الحالة التشغيلية</label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm transition-all appearance-none"
                >
                  <option value="يعمل بكفاءة">يعمل بكفاءة</option>
                  <option value="تحت الصيانة">تحت الصيانة</option>
                  <option value="معطل مؤقتاً">معطل مؤقتاً</option>
                  <option value="بحاجة إلى فحص">بحاجة إلى فحص عاجل</option>
                </select>
                <FaToggleOn className="absolute top-3.5 right-3.5 text-slate-400" />
              </div>
            </div>

            {/* أزرار التحكم والتقديم */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Link to="/MedicalEquipment" className="w-1/2 md:w-auto">
                <button
                  type="button"
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
                >
                  إلغاء
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading || success}
                className="w-1/2 md:w-auto flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-teal-100 disabled:opacity-50"
              >
                {loading ? "جاري الحفظ..." : <><FaPlus size={12} /> حفظ الجهاز الطبي</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEquipment;