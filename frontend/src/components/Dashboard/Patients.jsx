import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaUserInjured, FaPhone, FaCalendarAlt, FaFileMedical, FaHistory, FaChevronLeft, FaChevronRight, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5; 

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/patients`);
      
      if (response.data.success) {
        setPatients(response.data.data || []);
      }
    } catch (err) {
      console.error("حدث خطأ أثناء جلب سجلات المرضى:", err);
      setError("فشل في تحميل سجلات المرضى من الخادم.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // الفلترة المحلية بناءً على اسم المريض أو رقم الهاتف
  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true;

    const nameMatch = patient.patientName && patient.patientName.toLowerCase().includes(searchLower);
    const phoneMatch = patient.phone && patient.phone.includes(searchLower);

    return nameMatch || phoneMatch;
  });

  const totalItems = filteredPatients.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const startIndex = (currentPage - 1) * limit;
  const currentPaginatedPatients = filteredPatients.slice(startIndex, startIndex + limit);

  // دالة تصدير قائمة المرضى لملف Excel
  const exportToExcel = () => {
    if (filteredPatients.length === 0) {
      return toast.info("لا توجد سجلات مرضى لتصديرها");
    }

    const excelData = filteredPatients.map(p => ({
      'اسم المريض': p.patientName,
      'العمر (سنة)': p.age,
      'رقم الهاتف': p.phone,
      'تاريخ آخر زيارة': p.lastVisit || 'لا يوجد',
      'التنبيه الطبي': p.medicalAlert || 'لا يوجد',
      'الوضع المالي (الديون المتبقية)': p.financialRecord?.remainingDebt ? `${p.financialRecord.remainingDebt} JD` : 'خالص / مسدد'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    
    // إعداد اتجاه الصفحة من اليمين إلى اليسار (RTL) لدعم العرض العربي المنظم
    if (!worksheet['!views']) worksheet['!views'] = [{}];
    worksheet['!views'][0].RTL = true;

    XLSX.utils.book_append_sheet(workbook, worksheet, "قائمة المرضى");
    XLSX.writeFile(workbook, `سجلات_المرضى_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("تم تصدير سجلات المرضى إلى Excel بنجاح");
  };


  return (
    <div className="bg-slate-50 min-h-screen pb-10 text-right font-sans" dir="rtl">
    {/* الهيدر العلوي - متجاوب ومنسق بدون تكرار */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 md:p-6 mx-4 md:mx-8 mt-6 rounded-2xl bg-white border border-slate-150 shadow-sm">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">سجلات المرضى</h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          إدارة الملفات الطبية الرقمية، التاريخ المرضي المرجعي، والأقساط المالية
        </p>
      </div>
      
      {/* قسم الأزرار العلوي (إضافة مريض + أدوات الاستخراج الجديدة) */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
        <button 
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors shadow-sm"
        >
          <FaFileExcel size={14} />
          تصدير Excel
        </button>
       
        <Link to="/AddPatient" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-teal-100 whitespace-nowrap">
            <FaPlus size={14} /> إضافة مريض جديد
          </button>
        </Link>
      </div>
    </div>
  
    {/* أدوات البحث والإحصاء السريع - متجاوبة */}
    <div className="px-4 md:px-8 py-6 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="ابحث باسم المريض أو رقم الهاتف..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm"
        />
        <FaSearch className="absolute top-3.5 right-3.5 text-slate-400" />
      </div>
  
      <div className="flex gap-4 w-full md:w-auto justify-start md:justify-end">
        <div className="w-full sm:w-auto bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-sm flex items-center gap-3 justify-center sm:justify-start">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          <p className="text-sm font-medium text-slate-600">
            إجمالي المسجلين: <span className="font-bold text-slate-900">{loading ? "..." : filteredPatients.length}</span>
          </p>
        </div>
      </div>
    </div>
  
    {/* جدول عرض المراجعين - حاوية مرنة للتمرير الأفقي */}
    <div className="px-4 md:px-8">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full block scrollbar-thin">
          <table className="w-full text-right border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs md:text-sm">
                <th className="p-4 font-medium">اسم المريض / العمر</th>
                <th className="p-4 font-medium">رقم الاتصال</th>
                <th className="p-4 font-medium">تاريخ آخر زيارة</th>
                <th className="p-4 font-medium">التنبيه الطبي</th>
                <th className="p-4 font-medium">الحساب (المتبقي / الديون)</th>
                <th className="p-4 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs md:text-sm text-slate-700">
              {loading && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400 animate-pulse">
                    جاري تحميل سجلات المرضى والملفات الطبية...
                  </td>
                </tr>
              )}
  
              {error && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-rose-500 font-medium">
                    {error}
                  </td>
                </tr>
              )}
  
              {!loading && !error && currentPaginatedPatients.map((patient) => {
                const hasAlert = patient.medicalAlert && 
                                 patient.medicalAlert !== "لا يوجد" && 
                                 patient.medicalAlert !== "لا يوجد تنبيهات طبية" && 
                                 patient.medicalAlert !== "لا يوجد تبيغات طبية هامة";
  
                const remainingDebt = Number(patient.financialRecord?.remainingDebt) || 0;
  
                return (
                  <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* اسم المريض والعمر */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-bold shrink-0">
                          <FaUserInjured size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{patient.patientName}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{patient.age} سنة</p>
                        </div>
                      </div>
                    </td>
  
                    {/* رقم الهاتف */}
                    <td className="p-4 text-slate-600 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5" style={{ direction: 'ltr' }}>
                        <FaPhone size={12} className="text-slate-400" />
                        {patient.phone}
                      </span>
                    </td>
  
                    {/* آخر زيارة */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <FaCalendarAlt size={12} className="text-slate-400" />
                        {patient.lastVisit}
                      </span>
                    </td>
  
                    {/* التنبيهات الطبية */}
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border
                        ${hasAlert 
                          ? 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse' 
                          : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                        {hasAlert && <FaHistory size={10} />}
                        {patient.medicalAlert}
                      </span>
                    </td>
  
                    {/* الرصيد المالي */}
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold border ${
                        remainingDebt > 0 
                          ? "bg-amber-50 border-amber-200 text-amber-700" 
                          : "bg-emerald-50 border-emerald-200 text-emerald-700"
                      }`}>
                        {remainingDebt > 0 
                          ? `متبقي عليه: ${patient.financialRecord.remainingDebt} JD` 
                          : "خالص / مسدد بالكامل"}
                      </span>
                    </td>
  
                    {/* إجراءات معاينة الملف */}
                    <td className="p-4 text-left whitespace-nowrap">
                      <Link to={"/PatientFile/" + patient._id}>
                        <button className="text-teal-600 hover:text-white font-medium text-xs border border-teal-200 hover:bg-teal-600 px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-sm shadow-teal-50">
                          <FaFileMedical size={12} /> معاينة الملف
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
  
              {!loading && !error && currentPaginatedPatients.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    لا يوجد مرضى يطابقون اسم البحث أو الهاتف حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  
        {/* شريط التحكم بالصفحات (Pagination) - متجاوب */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center p-4 bg-slate-50 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium order-2 sm:order-none">
              الصفحة {currentPage} من {totalPages}
            </span>
            <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end order-1 sm:order-none">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <FaChevronRight size={10} /> السابق
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                التالي <FaChevronLeft size={10} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Patients;