import React, { useState, useEffect } from 'react';
import { FaPlus, FaTools, FaCheckCircle, FaExclamationCircle, FaWrench, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdOutlineComputer } from 'react-icons/md';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const EquipmentInventory = () => {
  // حالات إدارة البيانات والاتصال بالباك-أند
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // حالات الـ Pagination المحلية
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5; // عدد العناصر في كل صفحة

  // دالة جلب البيانات من الباك-أند
  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/medical-equipment`);
      
      if (response.data.success) {
        setEquipments(response.data.data || []);
      }
    } catch (err) {
      console.error("حدث خطأ أثناء جلب الأجهزة الطبية:", err);
      setError("فشل في تحميل سجل الأجهزة الطبية من الخادم.");
    } finally {
      setLoading(false);
    }
  };

  // جلب الأجهزة الطبية عند تحميل الصفحة
  useEffect(() => {
    fetchEquipment();
  }, []);

  // 1. الفلترة المحلية بناءً على اسم الجهاز أو موقعه
  const filteredEquipment = equipments.filter(equipment => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true;

    const nameMatch = equipment.equipmentName && equipment.equipmentName.toLowerCase().includes(searchLower);
    const locationMatch = equipment.location && equipment.location.toLowerCase().includes(searchLower);

    return nameMatch || locationMatch;
  });

  // 2. عمليات حساب الـ Pagination والإحصائيات
  const totalItems = filteredEquipment.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  // حساب الإحصائيات حركياً بناءً على البيانات القادمة من الباك-أند
  const activeCount = equipments.filter(e => e.status === 'active' || e.status === 'يعمل بكفاءة').length;
  const maintenanceCount = equipments.filter(e => e.status === 'maintenance' || e.status === 'تحت الصيانة').length;

  // دالة التعامل مع تغيير نص البحث
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // العودة للصفحة الأولى دائماً عند البحث
  };

  // 3. اقتطاع الأجهزة الخاصة بالصفحة الحالية فقط
  const startIndex = (currentPage - 1) * limit;
  const currentPaginatedEquipment = filteredEquipment.slice(startIndex, startIndex + limit);

  return (
    <div className="bg-slate-50 min-h-screen pb-10 text-right" dir="rtl">
      {/* الهيدر العلوي */}
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">جرد المعدات والأجهزة الطبية</h1>
          <p className="text-slate-400 text-sm mt-1">متابعة الأصول الثابتة، الحالة التشغيلية، وجدول الصيانة الدورية للأجهزة</p>
        </div>
        <Link to="/AddEquipment">
          <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-teal-100">
            <FaPlus size={14} /> تسجيل جهاز جديد
          </button>
        </Link>
      </div>

      {/* بطاقات الإحصائيات السريعة للأجهزة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <FaCheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">أجهزة تعمل بكفاءة</p>
            <p className="text-xl font-bold text-slate-800">
              {loading ? "..." : `${activeCount} أجهزة نشطة`}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <FaTools size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">أجهزة تحت الصيانة الآن</p>
            <p className="text-xl font-bold text-slate-800">
              {loading ? "..." : `${maintenanceCount} قيد الإصلاح`}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <FaExclamationCircle size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">إجمالي الأجهزة المسجلة</p>
            <p className="text-xl font-bold text-slate-800">
              {loading ? "..." : `${equipments.length} أجهزة بالمنظومة`}
            </p>
          </div>
        </div>
      </div>

      {/* شريط البحث السريع */}
      <div className="px-8 pb-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="ابحث عن جهاز طبي أو موقع التواجد..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 shadow-sm"
          />
          <FaSearch className="absolute top-3.5 right-3.5 text-slate-400" />
        </div>
      </div>

      {/* جدول جرد الأجهزة وحالتها */}
      <div className="px-8">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                  <th className="p-4 font-medium">اسم الجهاز الطبي</th>
                  <th className="p-4 font-medium">موقع التواجد</th>
                  <th className="p-4 font-medium">تاريخ آخر صيانة</th>
                  <th className="p-4 font-medium">الفحص الدوري القادم</th>
                  <th className="p-4 font-medium">الحالة التشغيلية</th>
                  <th className="p-4 font-medium text-left">التحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {loading && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-400 animate-pulse">جاري جلب بيانات الأجهزة الطبية...</td>
                  </tr>
                )}

                {error && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-rose-500 font-medium">{error}</td>
                  </tr>
                )}

                {!loading && !error && currentPaginatedEquipment.map((equipment) => {
                  // التحقق من حالة الجهاز لتلوين الشارة البصرية بشكل سليم
                  const isActive = equipment.status === 'active' || equipment.status === 'يعمل بكفاءة';
                  return (
                    <tr key={equipment.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <MdOutlineComputer className="text-slate-400 text-lg" />
                          {equipment.equipmentName}
                        </div>
                      </td>
                      <td className="p-4 text-slate-500">
                        {equipment.location}
                      </td>
                      <td className="p-4 text-slate-600 font-medium">
                        {equipment.lastMaintenance}
                      </td>
                      <td className="p-4 text-teal-600 font-medium">
                        {equipment.nextMaintenance}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border
                          ${isActive 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'}`}>
                          {isActive ? <FaCheckCircle size={12} /> : <FaWrench size={12} />}
                          {equipment.status}
                        </span>
                      </td>
                      <td className="p-4 text-left">
                        <button className="text-slate-700 hover:text-teal-600 font-medium text-xs border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1">
                          <FaWrench size={10} /> طلب صيانة
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {!loading && !error && currentPaginatedEquipment.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-400">لا توجد أجهزة مطابقة للبحث حالياً.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* شريط التحكم بالصفحات للفرونت-أند (Pagination) */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex justify-between items-center p-4 bg-slate-50 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                الصفحة {currentPage} من {totalPages}
              </span>
              <div className="flex gap-2">
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

export default EquipmentInventory;