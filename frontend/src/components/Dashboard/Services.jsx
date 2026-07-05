import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaStethoscope, FaClock, FaMoneyBillWave, FaEdit, FaTrashAlt, FaChevronLeft, FaChevronRight, FaTimes, FaSave, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Services = () => {
  // الحالات الأساسية للبيانات
  const [allServices, setAllServices] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // حالات الـ Pagination المحلي
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5; 

  // حاله المودال والخدمة المراد تعديلها
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // دالة جلب البيانات كاملة
  const fetchAllServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/services`);
      if (response.data.success) {
        const data = response.data.data || [];
        setAllServices(data);
      }
    } catch (err) {
      console.error("حدث خطأ أثناء جلب الخدمات:", err);
      setError("فشل في تحميل الخدمات الطبية من الخادم.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  // دالة حذف الخدمة الطبية
  const handleDelete = async (id, name) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف خدمة: (${name}) نهائياً؟`)) {
      try {
        const response = await axios.delete(`${API_URL}/services/${id}`);
        if (response.data.success) {
          setAllServices(prev => prev.filter(service => service.id !== id));
          toast.success("تم حذف الخدمة بنجاح", {
            className: "!text-black !bg-white border border-teal-600",
            progressClassName: "!bg-teal-300",
          });
        }
      } catch (err) {
        console.error("حدث خطأ أثناء الحذف:", err);
        toast.error(err.response?.data?.message || "فشل في إتمام عملية الحذف.", {
          className: "!text-red !bg-white border border-red-600",
          progressClassName: "!bg-red-300",
        });
      }
    }
  };

  // فتح المودال وتجهيز بيانات التعديل
  const openEditModal = (service) => {
    setEditingService({ ...service });
    setIsEditModalOpen(true);
  };

  // دالة حفظ التعديلات وإرسالها للباك إند
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      const response = await axios.put(`${API_URL}/services/${editingService.id}`, editingService);
      
      if (response.data.success) {
        setAllServices(prev => 
          prev.map(service => service.id === editingService.id ? response.data.data : service)
        );
        setIsEditModalOpen(false);
        setEditingService(null);
        toast.success("تم تحديث بيانات الخدمة بنجاح", {
          className: "!text-black !bg-white border border-teal-600",
          progressClassName: "!bg-teal-300",
        });
      }
    } catch (err) {
      console.error("حدث خطأ أثناء التحديث:", err);
      toast.error(err.response?.data?.message || "فشل في تحديث بيانات الخدمة.", {
        className: "!text-red !bg-white border border-red-600",
        progressClassName: "!bg-red-300",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // الفلترة المحلية
  const filteredServices = allServices.filter(service => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true;

    const nameMatch = service.serviceName && service.serviceName.toLowerCase().includes(searchLower);
    const categoryMatch = service.category && service.category.toLowerCase().includes(searchLower);
    
    return nameMatch || categoryMatch;
  });

  // حسابات الـ Pagination المحلي
  const totalServices = filteredServices.length;
  const totalPages = Math.ceil(totalServices / limit) || 1;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * limit;
  const currentPaginatedServices = filteredServices.slice(startIndex, startIndex + limit);

  // دالة تصدير الخدمات لملف Excel
  const exportToExcel = () => {
    if (filteredServices.length === 0) {
      return toast.info("لا توجد خدمات لتصديرها");
    }

    const excelData = filteredServices.map(s => ({
      'الإجراء / الخدمة الطبية': s.serviceName,
      'التصنيف العلاجي': s.category || 'غير مصنف',
      'الوقت المتوقع': s.expectedTime,
      'السعر الأساسي': `${s.basePrice} JOD`,
      'حالة الخدمة': s.status === 'نشط' || s.status === 'active' ? 'متاحة للطلب' : s.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    
    // دعم اتجاه اليمين لليسار (RTL) للغة العربية في المخرجات
    if (!worksheet['!views']) worksheet['!views'] = [{}];
    worksheet['!views'][0].RTL = true;

    XLSX.utils.book_append_sheet(workbook, worksheet, "الخدمات الطبية");
    XLSX.writeFile(workbook, `دليل_الخدمات_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("تم تصدير دليل الخدمات الطبية إلى Excel بنجاح");
  };



  return (
    <div className="bg-slate-50 min-h-screen pb-10 text-right px-4 md:px-0" dir="rtl">
    {/* الهيدر العلوي - متجاوب بالكامل */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 mx-0 md:mx-[32px] my-6 gap-4 rounded-2xl bg-white border border-slate-150 shadow-sm">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">الخدمات والإجراءات العلاجية</h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">تحديد أسعار المعالجات، المدد الزمنية المتوقعة، والتصنيفات الطبية لخدمات العيادة</p>
      </div>
      
      {/* أدوات التحكم (أزرار الاستخراج المضافة حديثاً بجانب زر الإضافة الأساسي) */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
        <button 
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors shadow-sm"
        >
          <FaFileExcel size={14} />
          تصدير Excel
        </button>
       
        <Link to="/AddService" className="w-full sm:w-auto">
          <button className="flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-teal-100">
            <FaPlus size={14} /> إضافة خدمة جديدة
          </button>
        </Link>
      </div>
    </div>
  
    {/* أدوات البحث والفلترة السريعة */}
    <div className="px-0 md:px-8 py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="ابحث عن خدمة أو تصنيف علاجي..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm"
        />
        <FaSearch className="absolute top-3.5 right-3.5 text-slate-400" />
      </div>
  
      <div className="w-full md:w-auto flex justify-start md:justify-end">
        <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          <p className="text-sm font-medium text-slate-600">نتائج البحث المتاحة: <span className="font-bold text-slate-900">{totalServices}</span></p>
        </div>
      </div>
    </div>
  
    {/* جدول عرض الخدمات المعرفة */}
    <div className="px-0 md:px-8 mt-2">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full block scrollbar-thin">
          <table className="w-full min-w-[800px] text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs md:text-sm">
                <th className="p-4 font-medium">الإجراء / الخدمة الطبية</th>
                <th className="p-4 font-medium">التصنيف</th>
                <th className="p-4 font-medium">الوقت المتوقع</th>
                <th className="p-4 font-medium">السعر الأساسي</th>
                <th className="p-4 font-medium">الحالة</th>
                <th className="p-4 font-medium text-center">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs md:text-sm text-slate-700">
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400 animate-pulse">جاري جلب الخدمات الطبية...</td>
                </tr>
              )}
  
              {error && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-rose-500 font-medium">{error}</td>
                </tr>
              )}
  
              {!loading && !error && currentPaginatedServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <FaStethoscope className="text-slate-400 shrink-0" />
                      <span className="truncate max-w-[200px]" title={service.serviceName}>{service.serviceName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-teal-700 bg-teal-50 border border-teal-100/50 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap">
                      {service.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <FaClock size={12} className="text-slate-400" />
                      {service.expectedTime}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-800 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <FaMoneyBillWave size={12} className="text-emerald-500" />
                      {service.basePrice} JOD
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      service.status === 'نشط' || service.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {service.status === 'نشط' || service.status === 'active' ? 'متاحة للطلب' : service.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => openEditModal(service)}
                        className="text-slate-600 hover:text-teal-600 font-medium text-xs border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <FaEdit size={12} /> تعديل
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id, service.serviceName)}
                        className="text-rose-600 hover:text-white font-medium text-xs border border-rose-200 hover:bg-rose-600 px-2.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <FaTrashAlt size={12} /> حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
  
              {!loading && !error && currentPaginatedServices.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">لا توجد خدمات مطابقة للبحث أو مضافة حالياً.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  
        {/* شريط الـ Pagination المحلي */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-slate-50 border-t border-slate-100 gap-3">
            <span className="text-xs text-slate-500 font-medium order-2 sm:order-1">
              الصفحة {currentPage} من {totalPages}
            </span>
            <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2 justify-between sm:justify-end">
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
  
    {/* Modal التعديل المنبثق */}
    {isEditModalOpen && editingService && (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden my-auto max-h-[calc(100vh-2rem)] flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <h2 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
              <FaEdit className="text-teal-600" /> تعديل بيانات الخدمة الطبية
            </h2>
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>
  
          <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">اسم الخدمة أو الإجراء الطبي</label>
              <input 
                type="text"
                required
                value={editingService.serviceName}
                onChange={(e) => setEditingService({...editingService, serviceName: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">التصنيف</label>
                <input 
                  type="text"
                  value={editingService.category}
                  onChange={(e) => setEditingService({...editingService, category: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">الوقت المتوقع (مثال: 45 دقيقة)</label>
                <input 
                  type="text"
                  required
                  value={editingService.expectedTime}
                  onChange={(e) => setEditingService({...editingService, expectedTime: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">السعر الأساسي (JOD)</label>
                <input 
                  type="number"
                  required
                  value={editingService.basePrice}
                  onChange={(e) => setEditingService({...editingService, basePrice: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">الحالة</label>
                <select 
                  value={editingService.status}
                  onChange={(e) => setEditingService({...editingService, status: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                >
                  <option value="نشط">نشط (متاحة للطلب)</option>
                  <option value="قيد المراجعة">قيد المراجعة</option>
                  <option value="موقوف مؤقتاً">موقوف مؤقتاً</option>
                </select>
              </div>
            </div>
  
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all shadow-md shadow-teal-100 disabled:opacity-50"
              >
                <FaSave size={14} /> {submitLoading ? "جاري الحفظ..." : "حفظ التعديلات"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
  );
};

export default Services;