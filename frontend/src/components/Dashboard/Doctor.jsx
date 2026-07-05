import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserMd, FaPhone, FaEnvelope, FaTrash, FaEdit, FaEye, FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

export default function DoctorsPage() {
  // حالات تخزين البيانات
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDoctor, setViewDoctor] = useState(null);

  // حالة الفورم (للإضافة والتعديل)
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    phone: '',
    email: '',
  });

  // 1. جلب بيانات الأطباء عند تحميل الصفحة
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات الأطباء:', error);
      toast.error('فشل في تحميل قائمة الأطباء');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // 2. التعامل مع مدخلات الفورم
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const response = await axios.put(`${API_URL}/${editId}`, formData);
        
        if (response.data.success) {
          setDoctors(prevDoctors => 
            prevDoctors.map(doc => 
              doc.id === editId ? { ...doc, ...formData } : doc
            )
          );
  
          if (viewDoctor && viewDoctor.id === editId) {
            setViewDoctor({ id: editId, ...formData });
          }
  
          alert('تم تحديث بيانات الطبيب بنجاح');
        }
      } else {
        const response = await axios.post(API_URL, formData);
        if (response.data.success) {
          toast.success('تم إضافة الطبيب بنجاح', {
            className: "!text-black !bg-white border border-teal-600",
            progressClassName: "!bg-teal-300",
          });
          fetchDoctors(); 
        }
      }
      closeModal();
    } catch (error) {
      console.error('خطأ أثناء الحفظ:', error);
      toast.error(error.response?.data?.message || 'فشل في حفظ البيانات', {
        className: "!text-red-500 !bg-white border border-red-600",
        progressClassName: "!bg-red-300",
      });
    }
  };

  // 4. حذف طبيب
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطبيب نهائياً من المنظومة؟')) {
      try {
        const response = await axios.delete(`${API_URL}/${id}`);
        if (response.data.success) {
          toast.success(response.data.message, {
            className: "!text-black !bg-white border border-teal-600",
            progressClassName: "!bg-teal-300",
          });
          fetchDoctors();
          if (viewDoctor?.id === id) setViewDoctor(null);
        }
      } catch (error) {
        console.error('خطأ أثناء الحذف:', error);
        toast.error('فشل في حذف سجل الطبيب', {
          className: "!text-red-500 !bg-white border border-red-600",
          progressClassName: "!bg-red-300",
        });
      }
    }
  };

  // 5. تجهيز البيانات للتعديل فتح المودال
  const handleEditClick = (doctor) => {
    setEditId(doctor.id);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      phone: doctor.phone,
      email: doctor.email || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ name: '', specialty: '', phone: '', email: '' });
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans" dir="rtl">
      
      {/* الهيدر وزر الإضافة متجاوب */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaUserMd className="text-teal-600 shrink-0" /> إدارة الطاقم الطبي
          </h1>
          <p className="text-xs text-slate-500 mt-1">إضافة، تعديل، وحذف بيانات الأطباء في المنظومة</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm flex justify-center items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
        >
          <FaPlus size={12} /> إضافة طبيب جديد
        </button>
      </div>

      {/* توزيع العناصر الرئيسي المتجاوب */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* جدول عرض الأطباء */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5">
          <h3 className="text-sm md:text-md font-bold text-slate-800 mb-4">قائمة الأطباء الحاليين</h3>
          
          <div className="overflow-x-auto w-full block scrollbar-thin">
            {loading ? (
              <p className="text-center text-sm text-slate-400 py-10">جاري تحميل البيانات...</p>
            ) : doctors.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-10">لا يوجد أطباء مسجلين حالياً.</p>
            ) : (
              <table className="w-full text-right text-sm min-w-[600px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium text-xs">
                    <th className="pb-3 pr-2">الطبيب</th>
                    <th className="pb-3">التخصص</th>
                    <th className="pb-3">رقم الهاتف</th>
                    <th className="pb-3 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs md:text-sm">
                  {doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pr-2 font-semibold text-slate-800 whitespace-nowrap">{doc.name}</td>
                      <td className="py-3.5 text-slate-600 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium">{doc.specialty}</span>
                      </td>
                      <td className="py-3.5 text-slate-600 whitespace-nowrap">{doc.phone}</td>
                      <td className="py-3.5">
                        <div className="flex justify-center gap-1">
                          <button onClick={() => setViewDoctor(doc)} className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="عرض التفاصيل">
                            <FaEye size={14} />
                          </button>
                          <button onClick={() => handleEditClick(doc)} className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="تعديل">
                            <FaEdit size={14} />
                          </button>
                          <button onClick={() => handleDelete(doc.id)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="حذف">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* كارد الجانب الأيسر: ملف الطبيب التفصيلي */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 h-fit order-last lg:order-none">
          <h3 className="text-sm md:text-md font-bold text-slate-800 mb-4 border-b border-slate-50 pb-3">ملف الطبيب التفصيلي</h3>
          {viewDoctor ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-teal-50/50 p-3 rounded-xl border border-teal-100/50">
                <div className="p-3 bg-teal-600 text-white rounded-xl shrink-0"><FaUserMd size={20} /></div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm md:text-md truncate">{viewDoctor.name}</h4>
                  <p className="text-xs text-teal-700 font-medium truncate">{viewDoctor.specialty}</p>
                </div>
              </div>
              <div className="space-y-3 text-xs md:text-sm text-slate-600 pt-2 break-all">
                <div className="flex items-center gap-2"><FaPhone className="text-slate-400 shrink-0" size={13} /> <span>{viewDoctor.phone}</span></div>
                <div className="flex items-center gap-2"><FaEnvelope className="text-slate-400 shrink-0" size={13} /> <span>{viewDoctor.email || 'لا يوجد بريد إلكتروني'}</span></div>
              </div>
              <button onClick={() => setViewDoctor(null)} className="w-full text-center text-xs text-slate-400 hover:text-slate-600 pt-4 block border-t border-slate-50 transition-colors">إغلاق الملف التفصيلي</button>
            </div>
          ) : (
            <p className="text-center text-xs text-slate-400 py-8">انقر على أيقونة العين ( 👁 ) بجانب أي طبيب لعرض بياناته التفصيلية هنا.</p>
          )}
        </div>
      </div>

      {/* بوب-أب مودال (Modal) للإضافة والتعديل متجاوب تماماً */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden my-auto max-h-[calc(100vh-2rem)] flex flex-col">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
              <h3 className="text-xs md:text-sm font-bold">{editId ? 'تعديل بيانات الطبيب' : 'إضافة طبيب جديد للمنظومة'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors"><FaTimes size={16} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">اسم الطبيب الكلي *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="د. أحمد علي" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">التخصص الطبي *</label>
                <input type="text" name="specialty" required value={formData.specialty} onChange={handleChange} placeholder="مثال: طب وجراحة الأسنان" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">رقم الهاتف *</label>
                <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder="07xxxxxxxx" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-left" dir="ltr" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">البريد الإلكتروني</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="doctor@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-left" dir="ltr" />
              </div>

              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors mt-4 shadow-sm shrink-0">
                {editId ? 'حفظ التعديلات المحدثة' : 'تسجيل الطبيب بالمنظومة'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}