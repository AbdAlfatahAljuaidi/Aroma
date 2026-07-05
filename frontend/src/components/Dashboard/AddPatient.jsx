import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserPlus, FaUser, FaPhone, FaExclamationTriangle, FaDollarSign, FaArrowRight, FaFileMedical, FaConciergeBell } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const AddPatient = () => {
  const navigate = useNavigate();

  
  const employee = JSON.parse(localStorage.getItem("employeeUser"));
  const employeeName = employee?.name;

  // حالات إدارة المدخلات المتطورة
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    employeeName:employeeName,
    phone: '',
    lastVisit: '',
    medicalAlert: 'لا يوجد تنبيهات طبية هامة',
    clinicalNotes: '', 
    selectedServiceId: '', // لتتبع الخدمة الطبية المختارة
    totalTreatmentCost: '0',  // سيتم تحديثها تلقائياً عند الاختيار
    amountPaid: '0',          
  });

  const [services, setServices] = useState([]); // قائمة الخدمات الطبية القادمة من السيرفر
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true); // مؤشر تحميل الخدمات
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // 1. جلب الخدمات الطبية عند تحميل المكون
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${apiUrl}/services`);
        if (response.data.success) {
          setServices(response.data.data);
        }
      } catch (err) {
        console.error("خطأ في جلب الخدمات الطبية:", err);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // حساب المتبقي تلقائياً في الواجهة لراحة المستخدم
  const remainingBalance = Number(formData.totalTreatmentCost) - Number(formData.amountPaid);

  // معالجة تغيير المدخلات
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'selectedServiceId') {
      // البحث عن الخدمة المختارة بناءً على المعرّف الفريد
      const selectedService = services.find(service => service.id === value);
      
      setFormData(prev => ({
        ...prev,
        selectedServiceId: value,
        // تحديث حقل التكلفة الإجمالية مباشرة بسعر الخدمة المحددة (basePrice)
        totalTreatmentCost: selectedService ? String(selectedService.basePrice || 0) : '0',
        // تحديث حقل الملاحظات السريرية بشكل تلقائي ليوثق اسم الخدمة
        clinicalNotes: selectedService ? `الخدمة المطلوبة: ${selectedService.serviceName}\n` : prev.clinicalNotes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.age || !formData.phone) {
      setError("يرجى ملء الحقول الأساسية (اسم المريض، العمر، ورقم الاتصال).");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // العثور على الخدمة لتمرير الاسم الصحيح إلى الباك-أند
      const currentService = services.find(s => s.id === formData.selectedServiceId);

      const payload = {
        patientName: formData.patientName,
        age: Number(formData.age),
        phone: formData.phone,
        lastVisit: formData.lastVisit || new Date().toISOString().split('T')[0],
        medicalAlert: formData.medicalAlert,
        clinicalNotes: formData.clinicalNotes, 
        employeeName:employeeName,
        requestedService: currentService ? currentService.serviceName : 'مخصصة/أخرى',
        
        financialRecord: {
          totalCost: Number(formData.totalTreatmentCost),
          totalPaid: Number(formData.amountPaid),
          remainingDebt: remainingBalance,
          paymentsHistory: [
            {
              amount: Number(formData.amountPaid),
              date: new Date().toISOString().split('T')[0],
              note: "الدفعة الأولى عند التسجيل / فتح الملف"
            }
          ]
        }
      };

      const response = await axios.post(`${apiUrl}/patients`, payload);

      if (response.data.success) {
        setSuccess(true);
        toast.success("تم تسجيل المريض ماليّاً وطبيّاً بنجاح!",{
          className: "!text-black !bg-white border border-teal-600",
          progressClassName: "!bg-teal-300",
        })
        setTimeout(() => {
          navigate('/Dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error("حدث خطأ أثناء إضافة المريض والتسجيل المالي:", err);
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
          <h1 className="text-2xl font-bold text-slate-800">تسجيل ملف مريض مالي وسريري متكامل</h1>
          <p className="text-slate-400 text-sm mt-1">إنشاء سجل صحي، توثيق التاريخ المرجعي، وجدولة الدفعات المالية للمريض</p>
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
          {success && <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-sm font-medium">تم تسجيل المريض ماليّاً وطبيّاً بنجاح! جاري التوجيه...</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            
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
                      placeholder="أدخل الاسم الكامل"
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
                    placeholder="السنة"
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
                      placeholder="07xxxxxxxx"
                      required
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-sm"
                    />
                    <FaPhone className="absolute top-3.5 right-3.5 text-slate-400 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">تاريخ الزيارة الحالية</label>
                  <input
                    type="date"
                    name="lastVisit"
                    value={formData.lastVisit || new Date().toISOString().split('T')[0]}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-sm text-right"
                  />
                </div>
              </div>
            </div>

            {/* القسم الجديد: اختيار الخدمة الطبية */}
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-sm font-bold text-teal-600 mb-4 flex items-center gap-2">🛎️ الخدمة الطبية المطلوبة</h3>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">اختر الخدمة الطبية لتحديد التكلفة تلقائياً</label>
                <div className="relative">
                  <select
                    name="selectedServiceId"
                    value={formData.selectedServiceId}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-sm appearance-none"
                  >
                    <option value="">-- اختر خدمة طبية (أو اتركها فارغة لتحديد سعر مخصص) --</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.serviceName} ({service.basePrice} JD)
                      </option>
                    ))}
                  </select>
                  <FaConciergeBell className="absolute top-3.5 right-3.5 text-slate-400" />
                  {loadingServices && <span className="absolute left-3 top-3 text-xs text-slate-400 animate-pulse">جاري تحميل الخدمات...</span>}
                </div>
              </div>
            </div>

            {/* القسم الثالث: الملف الطبي المرجعي والمحاذير */}
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
                      placeholder="اكتب هنا شكوى المريض الرئيسية، المعاينة السريرية، خطة العلاج بالتفصيل..."
                      rows="4"
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
                      placeholder="حساسية بنج، سكري، ضغط، سيلان دم..."
                      rows="2"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-sm"
                    ></textarea>
                    <FaExclamationTriangle className="absolute top-3.5 right-3.5 text-rose-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* القسم الرابع: الحسابات ونظام الدفعات */}
            <div>
              <h3 className="text-sm font-bold text-teal-600 mb-4 flex items-center gap-2">💰 المحاسبة ونظام الأقساط والدفع الذكي</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">التكلفة الإجمالية (JD)</label>
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
                  <label className="block text-xs font-bold text-slate-600 mb-2">المبلغ المدفوع الآن (JD)</label>
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
                  <label className="block text-xs font-bold text-slate-600 mb-2">المتبقي بذمة المريض</label>
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

            {/* أزرار الحفظ */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Link to="/PatientsInventory" className="w-1/2 md:w-auto">
                <button type="button" className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-medium transition-all">إلغاء</button>
              </Link>
              <button
                type="submit"
                disabled={loading || success}
                className="w-1/2 md:w-auto flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-teal-100 disabled:opacity-50"
              >
                {loading ? "جاري الحفظ والتسجيل..." : <><FaUserPlus size={14} /> حفظ السجل والملف المالي</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;