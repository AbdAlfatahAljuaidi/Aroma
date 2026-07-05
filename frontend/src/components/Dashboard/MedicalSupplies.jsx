import React, { useState, useEffect } from 'react';
import { FaPlus, FaExclamationTriangle, FaSearch, FaBoxes, FaChevronLeft, FaChevronRight, FaEdit, FaTrashAlt, FaTimes, FaSave } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const MedicalSupplies = () => {
  // حالات إدارة البيانات والاتصال بالباك-أند
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // حالات الـ Pagination المحلية
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5; 

  // حالات الـ Modal المنبثق الخاص بالتعديل
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // دالة جلب البيانات من الباك-أند
  const fetchSupplies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/supplies`);
      
      if (response.data.success) {
        setSupplies(response.data.data || []);
      }
    } catch (err) {
      console.error("حدث خطأ أثناء جلب المستلزمات الطبية:", err);
      setError("فشل في تحميل مستلزمات المخزن الطبية من الخادم.");
    } finally {
      setLoading(false);
    }
  };

  // جلب البيانات عند تحميل المكون لأول مرة
  useEffect(() => {
    fetchSupplies();
  }, []);

  // دالة حذف مادة طبية نهائياً من الباك إند والمصفوفة المحلية
  const handleDelete = async (id, name) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف المادة: (${name}) نهائياً من المخزن؟`)) {
      try {
        const response = await axios.delete(`${API_URL}/supplies/${id}`);
        if (response.data.success) {
          // تحديث الحالة محلياً للحذف الفوري من الجدول دون إعادة تحميل الصفحة
          setSupplies(prev => prev.filter(item => item.id !== id));
          toast.success("تم حذف المادة الطبية بنجاح",{
            className: "!text-black !bg-white border border-teal-600",
            progressClassName: "!bg-teal-300",
          });
        }
      } catch (err) {
        console.error("حدث خطأ أثناء الحذف:", err);
        toast.error(err.response?.data?.message || "فشل في إتمام عملية الحذف.",{
          className: "!text-red-500 !bg-white border border-red-600",
          progressClassName: "!bg-red-300",
        });
      }
    }
  };

  // فتح مودال التعديل وتجهيز البيانات المؤقتة للمادة المختارة
  const openEditModal = (supply) => {
    setEditingSupply({ ...supply });
    setIsEditModalOpen(true);
  };

  // إرسال البيانات المحدثة إلى الباك إند (PUT)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      const response = await axios.put(`${API_URL}/supplies/${editingSupply.id}`, editingSupply);

      if (response.data.success) {
        // تحديث العنصر داخل المصفوفة المحلية بالبيانات المحدثة والحالة المحسوبة الراجعة من السيرفر
        setSupplies(prev =>
          prev.map(item => item.id === editingSupply.id ? response.data.data : item)
        );
        setIsEditModalOpen(false);
        setEditingSupply(null);
        toast.success("تم تحديث بيانات المستلزم بنجاح",{
          className: "!text-black !bg-white border border-teal-600",
          progressClassName: "!bg-teal-300",
        });
      }
    } catch (err) {
      console.error("حدث خطأ أثناء التحديث:", err);
      toast.error(err.response?.data?.message || "فشل في تحديث بيانات المادة الطبية.",{
        className: "!text-red-500 !bg-white border border-red-600",
        progressClassName: "!bg-red-300",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // 1. الفلترة المباشرة بناءً على اسم المادة أو التصنيف
  const filteredSupplies = supplies.filter(item => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true;

    const nameMatch = item.itemName && item.itemName.toLowerCase().includes(searchLower);
    const categoryMatch = item.category && item.category.toLowerCase().includes(searchLower);
    
    return nameMatch || categoryMatch;
  });

  // 2. حسابات الـ Pagination والملخص التنبيهي
  const totalItems = filteredSupplies.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  // حساب المواد الحرجة بناءً على الحالة الراجعة من السيرفر أو الكميات
  const criticalItemsCount = supplies.filter(s => s.currentQuantity <= s.minQuantity).length;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // تصفير الصفحة عند البحث لضمان عدم حدوث تضارب في الفهرسة
  };

  // 3. اقتطاع صفحة المستلزمات الحالية للعرض
  const startIndex = (currentPage - 1) * limit;
  const currentPaginatedSupplies = filteredSupplies.slice(startIndex, startIndex + limit);

  return (
    <div className="bg-slate-50 min-h-screen pb-10 text-right px-4 md:px-0" dir="rtl">
    {/* الهيدر العلوي - متجاوب بالكامل */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 mx-0 md:mx-[32px] my-6 gap-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">المستلزمات الطبية والمستهلكات</h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">مراقبة مخزون المواد العلاجية اليومية وحدود الطلب الحرجة</p>
      </div>
      <Link to="/AddSupplies" className="w-full sm:w-auto">
        <button className="flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-teal-100">
          <FaPlus size={14} /> إضافة مادة جديدة
        </button>
      </Link>
    </div>
  
    {/* أدوات البحث والفلترة السريعة */}
    <div className="px-0 md:px-8 py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
      {/* شريط البحث */}
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="ابحث عن مادة طبية أو تصنيف..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm"
        />
        <FaSearch className="absolute top-3.5 right-3.5 text-slate-400" />
      </div>
  
      {/* ملخص سريع للمواد الحرجة */}
      <div className="w-full md:w-auto flex justify-start md:justify-end">
        <div className="bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl flex items-center gap-3 w-full md:w-auto justify-center md:justify-start shadow-sm">
          <FaExclamationTriangle className="text-amber-600 text-xl shrink-0" />
          <div>
            <p className="text-[11px] text-slate-500 font-medium">مواد شرفت على الانتهاء</p>
            <p className="text-xs md:text-sm font-bold text-amber-700 whitespace-nowrap">
              {loading ? "..." : `${criticalItemsCount} مواد تحتاج طلب`}
            </p>
          </div>
        </div>
      </div>
    </div>
  
    {/* جدول عرض البيانات */}
    <div className="px-0 md:px-8 mt-2">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full block scrollbar-thin">
          {/* تحديد min-w يضمن عدم انضغاط الجدول في الشاشات الصغيرة */}
          <table className="w-full min-w-[950px] text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs md:text-sm">
                <th className="p-4 font-medium">المادة الطبية</th>
                <th className="p-4 font-medium">التصنيف</th>
                <th className="p-4 font-medium">الكمية الحالية</th>
                <th className="p-4 font-medium">الحد الأدنى (الآمن)</th>
                <th className="p-4 font-medium">الحالة</th>
                <th className="p-4 font-medium">ملاحظات</th>
                <th className="p-4 font-medium text-center">إجراءات التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs md:text-sm text-slate-700">
              {loading && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400 animate-pulse">جاري فحص المستلزمات الطبية من المخزن...</td>
                </tr>
              )}
  
              {error && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-rose-500 font-medium">{error}</td>
                </tr>
              )}
  
              {!loading && !error && currentPaginatedSupplies.map((item) => {
                const isCritical = item.currentQuantity <= item.minQuantity;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <FaBoxes className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]" title={item.itemName}>{item.itemName}</span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-800 whitespace-nowrap">
                      {item.currentQuantity}
                    </td>
                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {item.minQuantity}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border
                        ${isCritical 
                          ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                        {item.status || (isCritical ? "بحاجة لطلب فوري" : "متوفر وآمن")}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400 max-w-xs truncate" title={item.notes}>
                      {item.notes || "-"}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="text-slate-600 hover:text-teal-600 font-medium text-xs border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <FaEdit size={12} /> تعديل
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.itemName)}
                          className="text-rose-600 hover:text-white font-medium text-xs border border-rose-200 hover:bg-rose-600 px-2.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <FaTrashAlt size={12} /> حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
  
              {!loading && !error && currentPaginatedSupplies.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">لا توجد مواد تطابق مدخلات البحث الحالية.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  
        {/* شريط التحكم بالصفحات المتجاوب */}
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
  
    {/* ==================== Modal التعديل المنبثق المتجاوب ==================== */}
    {isEditModalOpen && editingSupply && (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden my-auto max-h-[calc(100vh-2rem)] flex flex-col animate-in fade-in zoom-in-95 duration-200">
          {/* رأس المودال */}
          <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <h2 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
              <FaEdit className="text-teal-600" /> تعديل المادة والمستلزم الطبي
            </h2>
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>
  
          {/* فورم تعديل المستلزم - قابل للتمرير في الشاشات القصيرة جداً */}
          <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">اسم المادة الطبية</label>
              <input 
                type="text"
                required
                value={editingSupply.itemName}
                onChange={(e) => setEditingSupply({...editingSupply, itemName: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
  
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">التصنيف</label>
              <input 
                type="text"
                value={editingSupply.category}
                onChange={(e) => setEditingSupply({...editingSupply, category: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">الكمية الحالية في المخزن</label>
                <input 
                  type="number"
                  required
                  min="0"
                  value={editingSupply.currentQuantity}
                  onChange={(e) => setEditingSupply({...editingSupply, currentQuantity: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">الحد الأدنى (الآمن)</label>
                <input 
                  type="number"
                  required
                  min="0"
                  value={editingSupply.minQuantity}
                  onChange={(e) => setEditingSupply({...editingSupply, minQuantity: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
  
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">ملاحظات</label>
              <textarea 
                rows="3"
                value={editingSupply.notes}
                onChange={(e) => setEditingSupply({...editingSupply, notes: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 resize-none"
                placeholder="مثال: اسم المورد، أو تاريخ تسليم الشحنة القادمة..."
              />
            </div>
  
            {/* أزرار التحكم في أسفل المودال */}
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

export default MedicalSupplies;