import React, { useState, useEffect } from 'react';
import { 
  FaClock, FaCheckCircle, FaUserMd, FaPlus, FaPhoneAlt, 
  FaUser, FaStethoscope, FaChevronLeft, FaChevronRight, 
  FaCalendarAlt, FaTrashAlt, FaEdit 
} from 'react-icons/fa';
import { IoTimerOutline } from 'react-icons/io5';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  // حالة لتحديد ما إذا كنا نقوم بالتعديل (تحمل الـ ID الخاص بالموعد المراد تعديله)
  const [editingId, setEditingId] = useState(false);

  // حقول فلترة الجدول (القيمة الافتراضية هي تاريخ اليوم الحالي بصيغة YYYY-MM-DD)
  const getTodayDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - (offset * 60 * 1000));
    return localToday.toISOString().split('T')[0];
  };

  
  const employee = JSON.parse(localStorage.getItem("employeeUser"));
  const employeeName = employee?.name;


  const [filterDate, setFilterDate] = useState(getTodayDateString());

  // ---- حالات نظام تصفح الصفحات (Pagination States) ----
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5; 

  // حالات الحقول للنموذج 
  const [newPatient, setNewPatient] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDoctor, setNewDoctor] = useState('');
  const [newService, setNewService] = useState('');
  const [newStatus, setNewStatus] = useState('pending');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentDay, setAppointmentDay] = useState('');

  // الـ Lists القادمة من السيرفر لقوائم الاختيار
  const [patientsList, setPatientsList] = useState([]); 
  const [doctorsList, setDoctorsList] = useState([]); 
  
  // حالات التحكم بقائمة المرضى المنسدلة
  const [selectedPatientId, setSelectedPatientId] = useState(''); 
  const [selectedPatientName, setSelectedPatientName] = useState(''); 
  const [showDropdown, setShowDropdown] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(''); 

 
  const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

  // إعادة ضبط الصفحة الحالية عند تغيير التبويب أو تاريخ الفلتر لضمان دقة العرض
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filterDate]);

  // دالة معالجة اختيار التاريخ داخل الفورم واستخراج اليوم تلقائياً
  const handleDateChange = (dateValue) => {
    setAppointmentDate(dateValue);

    if (dateValue) {
      const daysArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const dateObj = new Date(dateValue);
      const dayName = daysArabic[dateObj.getDay()];
      setAppointmentDay(dayName);
    } else {
      setAppointmentDay('');
    }
  };

  // ==================== 1. جلب المواعيد من السيرفر (GET) ====================
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/bookAppointment`);
      if (Array.isArray(data)) {
        setAppointments(data);
      } else if (data && Array.isArray(data.data)) {
        setAppointments(data.data);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("خطأ في جلب المواعيد:", error.response?.data?.error || error.message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================== 2. جلب قوائم المرضى والأطباء ====================
  useEffect(() => {
    fetchAppointments();

    const fetchPatients = async () => {
      try {
        const response = await fetch(`${apiUrl}/patients`);
        const result = await response.json();
        if (result.success) {
          setPatientsList(result.data);
        }
      } catch (error) {
        console.error("خطأ في جلب قائمة المرضى:", error);
      }
    };

    const fetchDoctorsForDropdown = async () => {
      try {
        const response = await axios.get(apiUrl);
        if (response.data.success) {
          setDoctorsList(response.data.data);
        }
      } catch (error) {
        console.error('خطأ في جلب قائمة الأطباء للقائمة المنسدلة:', error);
      }
    };

    fetchPatients();
    fetchDoctorsForDropdown();
  }, []);

  // ==================== 3. تحديث حالة الحجز (التحديث السريع من الجدول) ====================
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(`${apiUrl}/bookAppointment/status/${appointmentId}`, { status: newStatus });
      
      if (response.status === 200) {
        setAppointments(prev => 
          prev.map(app => (app.id === appointmentId || app._id === appointmentId) ? { ...app, status: newStatus } : app)
        );
      }
    } catch (error) {
      console.error("خطأ في تحديث الحالة:", error.response?.data?.error || error.message);
      alert("فشل في تحديث الحالة، يرجى المحاولة لاحقاً.");
    }
  };

  // ==================== 4. حذف الموعد نهائياً (DELETE) ====================
  const handleDeleteAppointment = async (appointmentId, patientName) => {
    const confirmDelete = window.confirm(`هل أنت متأكد من حذف موعد المريض (${patientName}) نهائياً؟`);
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${apiUrl}/bookAppointment/${appointmentId}`);
      
      if (response.data.success) {
        setAppointments(prev => 
          prev.filter(app => app.id !== appointmentId && app._id !== appointmentId)
        );
        
        toast.success("تم حذف بيانات الموعد بنجاح",{
          className: "!text-black !bg-white border border-teal-600",
          progressClassName: "!bg-teal-300",
        });
      }
    } catch (error) {
      console.error("خطأ أثناء حذف الموعد:", error);
      alert("تعذر حذف الموعد من السيرفر.");
    }
  };

  // ==================== 5. الانتقال للتعديل الكامل وملء الحقول ====================
  const handleEditAppointment = (appointmentId) => {
    const targetApp = appointments.find(app => (app.id === appointmentId || app._id === appointmentId));
    if (!targetApp) return;

    // ملء الحقول بالبيانات الحالية للموعد لغايات التعديل
    setEditingId(appointmentId);
    setNewPatient(targetApp.patientName);
    setSelectedPatientName(targetApp.patientName);
    setNewTime(targetApp.time);
    setNewDoctor(targetApp.doctor || '');
    setNewService(targetApp.service);
    setNewStatus(targetApp.status || 'pending');
    handleDateChange(targetApp.appointmentDate);

    // فتح الفورم وتوجيه النظر إليه
    setShowBookingForm(true);
  };

  // دالة لتصفير الحقول بعد الحفظ أو عند الإلغاء
  const resetFormFields = () => {
    setNewPatient('');
    setSelectedPatientId('');
    setSelectedPatientName('');
    setNewTime('');
    setNewService('');
    setAppointmentDate('');
    setAppointmentDay('');
    setNewDoctor('');
    setNewStatus('pending');
    setEditingId(null);
    setShowBookingForm(false);
  };

  // ==================== 6. إضافة موعد جديد أو تحديث موعد موجود (POST / PUT) ====================
  const handleAddAppointment = async (e) => {
   
    
    e.preventDefault();
    if (!newPatient || !newTime || !newService || !appointmentDate || !employeeName) return;
    
    const appointmentData = {
      patientName: newPatient,
      time: newTime,
      doctor: newDoctor, 
      service: newService,
      appointmentDay,
      appointmentDate,
      status: newStatus,
      employeeName
    };

   

    try {
      console.log("editingId",editingId);
      
      if (editingId) {
        // تحديث موعد موجود بالكامل عبر الـ PUT Request
        await axios.put(`${apiUrl}/updateAppointment/${editingId}`, appointmentData);
      
        toast.success("تم تعديل بيانات الموعد بنجاح",{
          className: "!text-black !bg-white border border-teal-600",
          progressClassName: "!bg-teal-300",
        });
      } else {
        // إضافة موعد جديد
        await axios.post(`${apiUrl}/bookAppointment`, appointmentData);
        
        toast.success("تم اضافة بيانات الموعد بنجاح",{
          className: "!text-black !bg-white border border-teal-600",
          progressClassName: "!bg-teal-300",
        });
      }
      await fetchAppointments();
      resetFormFields();
      setActiveTab('all');
    } catch (error) {
      toast.error("خطأ في حفظ الموعد:", error.response?.data?.error || error.message);
    }
  };

  // ---- منطق معالجة الفلترة بالتاريخ والحالة ----
  const filteredAppointments = appointments && Array.isArray(appointments)
    ? appointments.filter(app => {
        const matchDate = filterDate ? app.appointmentDate === filterDate : true;
        const matchTab = activeTab === 'all' ? true : app.status === activeTab;
        return matchDate && matchTab;
      })
    : [];

  // حساب الحواشي لعمل السلايس (Slice) الخاص بالـ Pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  // تصفية المرضى بناءً على البحث
  const filteredPatients = patientsList.filter(patient =>
    patient.patientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-10 text-right font-sans" dir="rtl">
  
    {/* الهيدر الإداري */}
    <div className="pt-6 px-4 sm:px-8 ">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center p-5 sm:p-6 rounded-2xl bg-white border border-slate-150 shadow-sm gap-4">
        <div className=''>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            {showBookingForm ? (editingId ? "تعديل تفاصيل الموعد" : "حجز موعد جديد") : "جدول المواعيد والحجوزات"}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {showBookingForm ? "أدخل بيانات المريض وتفاصيل الإجراء الطبي بدقة" : "تنظيم حجوزات المرضى اليومية وتوزيعها على الأطباء المناوبين"}
          </p>
        </div>
        
        <button 
          onClick={() => {
            if (showBookingForm) {
              resetFormFields();
            } else {
              setShowBookingForm(true);
            }
          }}
          className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-teal-100 cursor-pointer w-full sm:w-auto shrink-0"
        >
          {showBookingForm ? (
            <>عرض جدول المواعيد <FaChevronLeft size={12} /></>
          ) : (
            <><FaPlus size={13} /> حجز موعد جديد</>
          )}
        </button>
      </div>
    </div>
  
    {showBookingForm ? (
      /* ==================== نموذج الحجز والتعديل (Form) ==================== */
      <div className="max-w-2xl mx-auto px-4 sm:px-8 mt-6 sm:mt-10">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-8 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FaPlus className="text-teal-500" size={14} /> {editingId ? "تعديل معلومات الحجز الطبي" : "معلومات الحجز الطبي الجديد"}
          </h3>
          
          <form onSubmit={handleAddAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            
            <div className="md:col-span-2 relative">
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">اسم المريض</label>
              
              <div 
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs sm:text-sm cursor-pointer flex justify-between items-center text-slate-700 relative"
              >
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <FaUser size={13} />
                </span>
                
                {selectedPatientName ? (
                  <span className="font-medium text-slate-800 truncate pl-4">{selectedPatientName}</span>
                ) : (
                  <span className="text-slate-400 pr-1 truncate">انقر لاختيار المريض من المنظومة...</span>
                )}
              </div>
  
              {showDropdown && (
                <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-lg max-h-60 overflow-y-auto p-2 space-y-2">
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      placeholder="ابحث عن مريض..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-lg pr-3 pl-3 py-1.5 text-xs focus:outline-none focus:border-teal-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
  
                  <div className="divide-y divide-slate-50">
                    {filteredPatients.map(patient => (
                      <div 
                        key={patient.id || patient._id}
                        onClick={() => { 
                          setSelectedPatientId(patient.id || patient._id); 
                          setSelectedPatientName(patient.patientName); 
                          setNewPatient(patient.patientName);
                          setShowDropdown(false); 
                          setSearchQuery(''); 
                        }}
                        className="p-2 hover:bg-teal-50 text-xs rounded-lg cursor-pointer flex justify-between items-center transition-colors gap-2"
                      >
                        <span className="font-medium text-slate-800 truncate">{patient.patientName}</span>
                        {patient.phone && (
                          <span className="text-slate-400 text-[10px] shrink-0" dir="ltr">{patient.phone}</span>
                        )}
                      </div>
                    ))}
  
                    {filteredPatients.length === 0 && (
                      <p className="text-center text-xs text-slate-400 py-2">لا يوجد مريض يطابق هذا الاسم</p>
                    )}
                  </div>
                </div>
              )}
            </div>
      
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">وقت الموعد</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <FaClock size={13} />
                </span>
                <input 
                  type="text" 
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="مثال: 11:30 AM"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>
      
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">تاريخ الموعد</label>
              <input 
                type="date" 
                value={appointmentDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-teal-500 text-right"
                required
              />
            </div>
      
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1">يوم الموعد (يُحدد تلقائياً)</label>
              <input 
                type="text" 
                value={appointmentDay}
                placeholder="سيظهر اليوم هنا تلقائياً"
                className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none cursor-not-allowed font-medium"
                readOnly
              />
            </div>
      
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">الطبيب المعالج</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 pointer-events-none">
                  <FaUserMd size={13} />
                </span>
                <select 
                  value={newDoctor} 
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-teal-500 appearance-none text-right cursor-pointer"
                  required
                >
                  <option value="">-- اختر الطبيب المعالج --</option>
                  {doctorsList.map((doc) => (
                    <option key={doc.id || doc._id} value={doc.name}>
                      {doc.name} {doc.specialty ? `(${doc.specialty})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
      
            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">حالة الحجز</label>
              <select 
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="pending">⏳ قيد الانتظار</option>
                <option value="confirmed">✅ مؤكد</option>
                <option value="in-clinic">🏥 في العيادة</option>
                <option value="completed">🎉 مكتمل</option>
              </select>
            </div>
      
            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">نوع الإجراء الطبي (الخدمة)</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <FaStethoscope size={13} />
                </span>
                <input 
                  type="text" 
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="مثال: حشوة تجميلية، فحص دوري"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>
      
            <div className="md:col-span-2 flex flex-col-reverse sm:flex-row gap-3 mt-4">
              <button 
                type="button"
                onClick={resetFormFields}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer text-center"
              >
                إلغاء
              </button>
              <button 
                type="submit"
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-teal-500/10 active:scale-[0.99] cursor-pointer text-center"
              >
                {editingId ? "حفظ التعديلات وتحديث الموعد" : "حفظ وتأكيد الموعد الجديد"}
              </button>
            </div>
          </form>
        </div>
      </div>
  
    ) : (
      /* ==================== لوحة المواعيد والجدول الرئيسي ==================== */
      <>
        {/* فلتر التاريخ المتقدم */}
        <div className="px-4 sm:px-8 mt-6">
          <div className="inline-flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm w-full sm:w-auto">
            <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5 shrink-0">
              <FaCalendarAlt className="text-teal-500" size={13} /> فرز المواعيد حسب التاريخ:
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs sm:text-sm focus:outline-none focus:border-teal-500 text-right w-full sm:w-auto"
              />
              {filterDate !== getTodayDateString() && (
                <button 
                  onClick={() => setFilterDate(getTodayDateString())}
                  className="text-xs text-teal-600 font-bold hover:underline cursor-pointer shrink-0"
                >
                  اليوم
                </button>
              )}
            </div>
          </div>
        </div>
  
        {/* التبويبات المتجاوبة */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 px-4 sm:px-8 mt-4">
          {[
            { id: 'all', label: 'كل المواعيد', count: appointments.filter(a => !filterDate || a.appointmentDate === filterDate).length },
            { id: 'pending', label: 'قيد الانتظار', count: appointments.filter(a => a.status === 'pending' && (!filterDate || a.appointmentDate === filterDate)).length },
            { id: 'confirmed', label: 'مؤكدة', count: appointments.filter(a => a.status === 'confirmed' && (!filterDate || a.appointmentDate === filterDate)).length },
            { id: 'in-clinic', label: 'داخل العيادة', count: appointments.filter(a => a.status === 'in-clinic' && (!filterDate || a.appointmentDate === filterDate)).length },
            { id: 'completed', label: 'مكتملة', count: appointments.filter(a => a.status === 'completed' && (!filterDate || a.appointmentDate === filterDate)).length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border cursor-pointer
                ${activeTab === tab.id 
                  ? 'bg-teal-500 text-white border-teal-500 shadow-sm' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
  
        {/* جدول البيانات وحاويته المتجاوبة */}
        <div className="px-4 sm:px-8 mt-6">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="w-full text-right border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs sm:text-sm">
                      <th className="p-4 font-medium">تاريخ ووقت الموعد</th>
                      <th className="p-4 font-medium">اسم المريض</th>
                      <th className="p-4 font-medium">الطبيب المعالج</th>
                      <th className="p-4 font-medium">نوع الإجراء الطبي</th>
                      <th className="p-4 font-medium">حالة الحجز</th>
                      <th className="p-4 font-medium text-left pl-6">إجراءات سريعة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-slate-400">جاري تحميل البيانات من السيرفر...</td>
                      </tr>
                    ) : currentAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-slate-400">لا توجد مواعيد مسجلة لهذا التاريخ المحدد.</td>
                      </tr>
                    ) : (
                      currentAppointments.map((app) => {
                        const appId = app.id || app._id;
                        return (
                          <tr key={appId} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 font-semibold text-slate-900">
                              <span className="flex items-center gap-1.5 text-teal-600">
                                <FaClock size={12} /> {app.time}
                              </span>
                              <div className="text-[11px] font-normal text-slate-400 mt-1">
                                {app.appointmentDay ? `${app.appointmentDay} - ` : ''}{app.appointmentDate}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-medium text-slate-900">{app.patientName}</div>
                              <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5" dir="ltr">
                                <span className="text-right flex items-center gap-1">
                                  <FaPhoneAlt size={9} className="text-slate-400" /> {app.phone || 'بدون رقم'}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="flex items-center gap-1.5 text-slate-600">
                                <FaUserMd className="text-slate-400" size={13} /> {app.doctor}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-xs font-medium">
                                {app.service}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                                ${app.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                                  app.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                                  app.status === 'in-clinic' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 
                                  'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                {app.status === 'pending' && <IoTimerOutline size={12} />}
                                {app.status === 'confirmed' && <FaCheckCircle size={11} />}
                                {app.status === 'in-clinic' && <FaUserMd size={11} />}
                                {app.status === 'completed' && <FaCheckCircle size={11} />}
                                {app.status === 'pending' ? 'قيد الانتظار' : 
                                 app.status === 'confirmed' ? 'مؤكد' : 
                                 app.status === 'in-clinic' ? 'في العيادة' : 'مكتمل'}
                              </span>
                            </td>
                            <td className="p-4 text-left pl-6">
                              <div className="flex items-center justify-end gap-1.5">
                                <select 
                                  value={app.status} 
                                  onChange={(e) => handleUpdateStatus(appId, e.target.value)}
                                  className="bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs px-2 py-1 focus:outline-none focus:border-teal-500 cursor-pointer"
                                >
                                  <option value="pending">انتظار</option>
                                  <option value="confirmed">مؤكد</option>
                                  <option value="in-clinic">في العيادة</option>
                                  <option value="completed">مكتمل</option>
                                </select>
  
                                <button 
                                  onClick={() => handleEditAppointment(appId)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer shrink-0"
                                  title="تعديل الموعد"
                                >
                                  <FaEdit size={13} />
                                </button>
  
                                <button 
                                  onClick={() => handleDeleteAppointment(appId, app.patientName)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                                  title="حذف الموعد نهائياً"
                                >
                                  <FaTrashAlt size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
  
            {/* ==================== شريط التصفح (Pagination) المطور متجاوباً ==================== */}
            {!loading && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-4 bg-slate-50 border-t border-slate-100 gap-4">
                <div className="text-xs sm:text-sm text-slate-500 text-center sm:text-right">
                  عرض الإدخالات من <span className="font-semibold text-slate-700">{indexOfFirstAppointment + 1}</span> إلى <span className="font-semibold text-slate-700">{Math.min(indexOfLastAppointment, filteredAppointments.length)}</span> من أصل <span className="font-semibold text-slate-700">{filteredAppointments.length}</span> موعد
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border text-slate-600 transition-colors ${currentPage === 1 ? 'opacity-40 cursor-not-allowed bg-slate-100' : 'bg-white hover:bg-slate-50 border-slate-200 cursor-pointer'}`}
                  >
                    <FaChevronRight size={11} />
                  </button>
  
                  <div className="flex items-center gap-1 max-w-[160px] sm:max-w-none overflow-x-auto py-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-8 h-8 shrink-0 rounded-lg text-xs font-bold transition-all border cursor-pointer ${currentPage === pageNumber ? 'bg-teal-500 text-white border-teal-500 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border text-slate-600 transition-colors ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed bg-slate-100' : 'bg-white hover:bg-slate-50 border-slate-200 cursor-pointer'}`}
                  >
                    <FaChevronLeft size={11} />
                  </button>
                </div>
              </div>
            )}
  
          </div>
        </div>
      </>
    )}
  </div>
  );
};

export default Appointments;