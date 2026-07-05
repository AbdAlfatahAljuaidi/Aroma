import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaBoxes, FaLayerGroup, FaClipboardList, FaPlus, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const AddSupplies = () => {
  const navigate = useNavigate();

  // حالات إدارة المدخلات (Form State)
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'مواد استهلاكية', // قيمة افتراضية لتسهيل الإدخال
    currentQuantity: '',
    minQuantity: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  
  const employee = JSON.parse(localStorage.getItem("employeeUser"));
  const employeeName = employee?.name;

  // تحديث البيانات عند الكتابة في الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // إرسال البيانات إلى الباك-أند عند تقديم النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // تحقق بسيط قبل الإرسال
    if (!formData.itemName || !formData.currentQuantity || !formData.minQuantity) {
      setError("يرجى ملء كافة الحقول الأساسية المطلوبة.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // إرسال طلب POST للباك-أند
      const response = await axios.post(`${API_URL}/Supplies`, {
        itemName: formData.itemName,
        category: formData.category,
        currentQuantity: Number(formData.currentQuantity),
        minQuantity: Number(formData.minQuantity),
        notes: formData.notes,
        employeeName
      });

      if (response.data.success) {
        setSuccess(true);
        toast.success("تمت إضافة المادة الطبية بنجاح!",{
          className: "!text-black !bg-white border border-teal-600",
          progressClassName: "!bg-teal-300",
        });
        // توجيه المستخدم لصفحة المخزن الرئيسية بعد ثانيتين من النجاح
        setTimeout(() => {
          navigate(-1); // تأكد من مطابقة هذا المسار لمسار صفحة المخزن عندك
        }, 1500);
      }
    } catch (err) {
      console.error("حدث خطأ أثناء إضافة المادة الطبية:", err);
      toast.error(err.response?.data?.message || "فشل الاتصال بالسيرفر، يرجى المحاولة لاحقاً.",{
        className: "!text-red-500 !bg-white border border-red-600",
        progressClassName: "!bg-red-300",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-10 text-right" dir="rtl">
      {/* الهيدر العلوي */}
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إضافة مستلزم طبي للمخزن</h1>
          <p className="text-slate-400 text-sm mt-1">تسجيل مادة طبية جديدة وتحديد مستويات الأمان اللوجستي للعيادة</p>
        </div>
        <Link to="/Dashboard">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
            <FaArrowRight size={12} /> العودة للمخزن
          </button>
        </Link>
      </div>

      {/* نموذج الإدخال Form */}
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          
          {/* رسائل التنبيه والخطأ والنجاح */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-sm font-medium animate-pulse">
              تمت إضافة المادة بنجاح! جاري توجيهك إلى المخزن...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* اسم المادة الطبية */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">اسم المادة الطبية <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  placeholder="مثال: قفازات طبية، بنج موضعي، إلخ..."
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm transition-all"
                />
                <FaBoxes className="absolute top-3.5 right-3.5 text-slate-400" />
              </div>
            </div>

            {/* تصنيف المادة */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">التصنيف</label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm transition-all appearance-none"
                >
                  <option value="مواد استهلاكية">مواد استهلاكية</option>
                  <option value="أدوات جراحية">أدوات جراحية</option>
                  <option value="مواد حشوات">مواد حشوات وأسنان</option>
                  <option value="أجهزة ومعدات">أجهزة ومعدات</option>
                  <option value="مواد تعقيم">مواد تعقيم ونظافة</option>
                </select>
                <FaLayerGroup className="absolute top-3.5 right-3.5 text-slate-400" />
              </div>
            </div>

            {/* صف الكميات (الكمية الحالية والحد الأدنى) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* الكمية الحالية */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">الكمية الحالية في المخزن <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  name="currentQuantity"
                  value={formData.currentQuantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm transition-all"
                />
              </div>

              {/* الحد الأدنى الآمن */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">الحد الأدنى (الآمن المسموح به) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  name="minQuantity"
                  value={formData.minQuantity}
                  onChange={handleChange}
                  placeholder="مثال: إذا وصلت 10 نبهني"
                  min="0"
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm transition-all"
                />
              </div>
            </div>

            {/* ملاحظات إضافية */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ملاحظات إضافية</label>
              <div className="relative">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="أي تفاصيل تخص المورد أو شروط التخزين..."
                  rows="3"
                  className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm transition-all"
                ></textarea>
                <FaClipboardList className="absolute top-3.5 right-3.5 text-slate-400" />
              </div>
            </div>

            {/* أزرار التحكم والتقديم */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Link to="/MedicalSupplies" className="w-1/2 md:w-auto">
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
                {loading ? "جاري الحفظ..." : <><FaPlus size={12} /> حفظ المادة الجديدة</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSupplies;