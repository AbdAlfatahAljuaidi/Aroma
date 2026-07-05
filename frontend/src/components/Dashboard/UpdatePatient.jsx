import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaUserEdit, FaUser, FaPhone, FaExclamationTriangle, FaDollarSign, FaArrowRight, FaFileMedical, FaTrashAlt, FaHistory, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const UpdatePatient = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  // حالات إدارة المدخلات والتحميل للبيانات المحدثة
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    phone: '',
    lastVisit: '',
    medicalAlert: '',
    clinicalNotes: '',
    totalTreatmentCost: '0',
    amountPaid: '0',
  });

  const [paymentsHistory, setPaymentsHistory] = useState([]); 
  const [servicesList, setServicesList] = useState([]); // قائمة الخدمات الطبية المجلوبة من الباك إند
  const [selectedService, setSelectedService] = useState(''); // الخدمة المختارة حالياً لإضافتها
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // 1. جلب بيانات المريض والخدمات الطبية عند تحميل الصفحة
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/patients/${id}`);
        
        if (response.data.success) {
          const patient = response.data.data;
          setFormData({
            patientName: patient.patientName || '',
            age: patient.age || '',
            phone: patient.phone || '',
            lastVisit: patient.lastVisit || '',
            medicalAlert: patient.medicalAlert || '',
            clinicalNotes: patient.clinicalNotes || '',
            totalTreatmentCost: String(patient.financialRecord?.totalCost || '0'),
            amountPaid: String(patient.financialRecord?.totalPaid || '0'),
          });
          setPaymentsHistory(patient.financialRecord?.paymentsHistory || []);
        }
      } catch (err) {
        console.error("خطأ في استرجاع ملف المريض:", err);
        setError("فشل في جلب بيانات المريض من السيرفر.");
      } finally {
        setLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        // تحويلها إلى axios لتوحيد وتسهيل التعامل مع الـ Response البيانات
        const response = await axios.get(`${API_URL}/services`);
        if (response.data.success) {
          setServicesList(response.data.data || []);
        }
      } catch (error) {
        console.error("خطأ في جلب الخدمات الطبية:", error);
      }
    };

    if (id) {
      fetchPatientData();
      fetchServices();
    }
  }, [id]);

  // دالة التعامل مع إضافة إجراء طبي جديد ومزامنة التكلفة والبيان فوراً
  const handleAddService = () => {
    if (!selectedService) return;

    // تم تعديل المقارنة هنا إلى (==) لتفادي مشاكل اختلاف نوع البيانات (String vs Number / ObjectId)
    const service = servicesList.find(s => String(s.id) === String(selectedService) || s._id === selectedService);
    
    if (service) {
      // 1. حساب التكلفة الإجمالية الجديدة بعد إضافة سعر الخدمة
      const newTotalCost = Number(formData.totalTreatmentCost) + Number(service.basePrice);
      
      // 2. صياغة سطر الإجراء الجديد مع تاريخ اليوم
      const currentDate = new Date().toISOString().split('T')[0];
      const serviceLine = `\n[${currentDate}] - تم إضافة: ${service.serviceName} (+${service.basePrice} JD)`;
      
      // 3. تحديث الـ state وتعديل الملاحظات فوراً
      setFormData(prev => ({
        ...prev,
        totalTreatmentCost: String(newTotalCost),
        clinicalNotes: prev.clinicalNotes ? `${prev.clinicalNotes}${serviceLine}` : serviceLine.trim()
      }));

      // إعادة ضبط قائمة الاختيار المنسدلة
      setSelectedService('');
      toast.info(`تمت إضافة ${service.serviceName} إلى الحساب المؤقت بنجاح.`);
    } else {
      console.warn("لم يتم العثور على الخدمة المطابقة في المصفوفة:", selectedService);
    }
  };

  // حساب المتبقي تلقائياً في الواجهة
  const remainingBalance = Number(formData.totalTreatmentCost) - Number(formData.amountPaid);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 2. إرسال طلب التعديل والتحيين للباك-أند (updatePatient)
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.age || !formData.phone) {
      toast.error("يرجى ملء الحقول الأساسية (اسم المريض، العمر، ورقم الاتصال).",{
        className: "!text-red-500 !bg-white border border-red-600",
        progressClassName: "!bg-red-300",
      });
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      const payload = {
        patientName: formData.patientName,
        age: Number(formData.age),
        phone: formData.phone,
        lastVisit: formData.lastVisit,
        medicalAlert: formData.medicalAlert,
        clinicalNotes: formData.clinicalNotes,
        financialRecord: {
          totalCost: Number(formData.totalTreatmentCost),
          totalPaid: Number(formData.amountPaid),
          paymentsHistory: paymentsHistory 
        }
      };

      const response = await axios.put(`${API_URL}/patients/${id}`, payload);

      if (response.data.success) {
        setSuccess(true);
        toast.success("تم تحديث الملف الطبي والمالي للمريض بنجاح!",{
          className: "!text-black !bg-white border border-teal-600",
          progressClassName: "!bg-teal-300",
        })
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      }
    } catch (err) {
      console.error("حدث خطأ أثناء تعديل الملف الحسابي والطبي ومزامنته:", err);
      toast.error(err.response?.data?.message || "فشل تعديل البيانات، يرجى المحاولة لاحقاً.",{
        className: "!text-red-500 !bg-white border border-red-600",
        progressClassName: "!bg-red-300",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 3. إجراء حذف كرت المريض بالكامل من المنظومة (deletePatient)
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`هل أنت متأكد تماماً من حذف ملف المريض (${formData.patientName}) نهائياً؟ لا يمكن التراجع عن هذا الإجراء!`);
    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      setError(null);
      const response = await axios.delete(`${API_URL}/patients/${id}`);
      if (response.data.success) {
        alert("تم إزالة وثيقة المريض وحساباته من السجلات تماماً.");
        navigate(-1);
      }
    } catch (err) {
      console.error("فشل حذف ملف المريض المالي:", err);
      setError(err.response?.data?.message || "تعذر إتمام عملية الحذف من السيرفر.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center font-medium text-slate-500 animate-pulse">جاري تحميل بيانات السجل الرقمي للمريض...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-10 text-right" dir="rtl">
      {/* الهيدر العلوي */}
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">تحديث وإدارة الملف الطبي والمالي للمريض</h1>
          <p className="text-slate-400 text-sm mt-1">تعديل الملاحظات السريرية، التحكم بالذمم الحسابية، أو تصفية ملف المراجع</p>
        </div>
        <Link to="/Dashboard">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
            <FaArrowRight size={12} /> العودة لسجل المرضى
          </button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          
          {error && <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium">{error}</div>}
          {success && <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-sm font-medium">تمت معالجة وتعديل حسابات ومحاذير المريض السريرية بنجاح!</div>}

          {/* قسم ذكي جديد: إضافة إجراء سريع دون مسح القديم */}
          <div className="mb-6 bg-teal-50/50 border border-teal-100 p-4 rounded-2xl">
            <h3 className="text-sm font-bold text-teal-700 mb-2 flex items-center gap-2">🦷 إضافة إجراء طبي جديد للزيارة الحالية</h3>
            <p className="text-xs text-slate-500 mb-3">اختر الإجراء وسيتم إضافته إلى الملاحظات ورفع التكلفة تلقائياً</p>
            <div className="flex gap-3">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
              >
                <option value="">-- اختر الإجراء المطلوب (مثال: سحب عصب) --</option>
                {servicesList.map(service => (
                  <option key={service.id || service._id} value={service.id || service._id}>
                    {service.serviceName} ({service.basePrice} JD)
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddService}
                disabled={!selectedService}
                className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
              >
                <FaPlus size={12} /> إضافة للحساب
              </button>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* القسم الأول: البيانات الشخصية */}
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-sm font-bold text-teal-600 mb-4 flex items-center gap-2">👤 البيانات الشخصية والاتصال</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">اسم المريض ثلاثي <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-sm"
                    />
                    <FaUser className="absolute top-3.5 right-3.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">العمر <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">رقم الاتصال <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-sm"
                    />
                    <FaPhone className="absolute top-3.5 right-3.5 text-slate-400 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">تاريخ آخر زيارة للعيادة</label>
                  <input
                    type="date"
                    name="lastVisit"
                    value={formData.lastVisit}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-sm text-right"
                  />
                </div>
              </div>
            </div>

            {/* القسم الثاني: الملف الطبي المرجعي والمحاذير */}
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-sm font-bold text-teal-600 mb-4 flex items-center gap-2">📂 الملف الطبي والسجل المرجعي</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">الملف المرجعي وتفاصيل الحالة (ماذا سنفعل للمريض؟) <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <textarea
                      name="clinicalNotes"
                      value={formData.clinicalNotes}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-sm leading-relaxed"
                    ></textarea>
                    <FaFileMedical className="absolute top-3.5 right-3.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">المحاذير والتنبيهات الطبية الطارئة</label>
                  <div className="relative">
                    <textarea
                      name="medicalAlert"
                      value={formData.medicalAlert}
                      onChange={handleChange}
                      rows="2"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-sm"
                    ></textarea>
                    <FaExclamationTriangle className="absolute top-3.5 right-3.5 text-rose-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* القسم الثالث: الحسابات */}
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-sm font-bold text-teal-600 mb-4 flex items-center gap-2">💰 التعديل المالي المباشر على الحسابات</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">التكلفة الإجمالية المطلوبة (JD)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="totalTreatmentCost"
                      value={formData.totalTreatmentCost}
                      onChange={handleChange}
                      min="0"
                      className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-sm focus:outline-none focus:border-teal-500 font-semibold"
                    />
                    <FaDollarSign className="absolute top-3 right-3 text-slate-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">إجمالي المدفوع حتى الآن (JD)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="amountPaid"
                      value={formData.amountPaid}
                      onChange={handleChange}
                      min="0"
                      className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-sm focus:outline-none focus:border-teal-500 font-semibold text-emerald-600"
                    />
                    <FaDollarSign className="absolute top-3 right-3 text-emerald-500 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">المتبقي بذمة المريض (ديون)</label>
                  <div className={`w-full border rounded-xl px-4 py-2 text-sm font-bold h-[38px] flex items-center justify-between
                    ${remainingBalance > 0 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                    <span>{remainingBalance} JD</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-current">
                      {remainingBalance > 0 ? 'ذمم متبقية' : 'خالص مسدد'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* القسم الرابع: أرشيف وتاريخ الدفعات */}
            {paymentsHistory.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><FaHistory size={12} className="text-slate-400"/> أرشيف وتاريخ الدفعات (القادمة من الصندوق المالي)</h3>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 max-h-40 overflow-y-auto space-y-2">
                  {paymentsHistory.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-700">دفعة بقيمة: {item.amount} JD</span>
                        <span className="text-slate-400 text-[11px]">البيان: {item.description || item.note}</span>
                      </div>
                      <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-[10px] font-mono">{item.date?.split('T')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* أزرار الحفظ والإجراءات */}
            <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 px-5 py-2.5 rounded-xl text-sm font-medium transition-all order-2 md:order-1"
              >
                <FaTrashAlt size={13} /> حذف ملف المريض نهائياً
              </button>

              <div className="flex gap-3 w-full md:w-auto order-1 md:order-2 justify-end">
                <Link to="/Dashboard" className="w-1/2 md:w-auto">
                  <button type="button" className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-medium transition-all">إلغاء</button>
                </Link>
                <button
                  type="submit"
                  disabled={actionLoading || success}
                  className="w-1/2 md:w-auto flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-teal-100 disabled:opacity-50"
                >
                  {actionLoading ? "جاري المعالجة..." : <><FaUserEdit size={14} /> تحديث السجل والملف المالي</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePatient;