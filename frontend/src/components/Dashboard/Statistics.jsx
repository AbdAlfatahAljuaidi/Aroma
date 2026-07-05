import React, { useEffect, useState } from "react";
import axios from "axios"; 
import { FaMoneyBillWave, FaCalendarCheck, FaPercentage } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import Charts from "./Charts";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Statistics = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,   // عدد المواعيد المحجوزة
    totalRevenue: 0,        // مجموع الإيرادات
    totalDiscounts: 0,      // خصومات التأمين والمراجعين
    totalPatients: 0        // إجمالي عدد المرضى
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/statistics`);
        if (data.success) {
          setStats({
            totalAppointments: data.data.totalAppointments,
            totalRevenue: data.data.totalRevenue,
            totalDiscounts: data.data.totalDiscounts,
            totalPatients: data.data.totalPatients
          });
        }
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الإحصائيات الطبية:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 px-4" dir="rtl">
        <p className="text-lg sm:text-xl font-medium text-teal-600 animate-pulse text-center">
          جاري تحميل البيانات الطبية وتحليلها...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-10 text-right font-sans w-full" dir="rtl">
      
      {/* الهيدر العلوي */}
      <div className="pt-6 px-4 sm:px-8">
        <h1 className="p-5 sm:p-6 text-xl sm:text-2xl font-bold rounded-2xl bg-white border border-slate-150 text-slate-800 shadow-sm">
          لوحة تحكم العيادة
        </h1>
      </div>

      {/* رسالة الترحيب والملخص */}
      <div className="my-6 mx-4 sm:mx-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          نظرة عامة على العيادة
        </h2>
        <p className="text-teal-600 text-sm sm:text-base mt-1">
          إليك ملخص النشاط الطبي والحجوزات الفعلي من النظام
        </p>
      </div>

      {/* كروت الإحصائيات (Bento Grid Style - Responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-8 mb-6">

        {/* إجمالي الإيرادات */}
        <div className="shadow-sm border border-slate-100 p-5 rounded-2xl bg-white hover:shadow-md transition-all duration-350">
          <div className="flex justify-between items-center gap-4">
            <div className="overflow-hidden">
              <h3 className="text-slate-500 text-xs sm:text-sm font-medium truncate">إجمالي الإيرادات</h3>
              <span className="font-bold text-xl sm:text-2xl mt-2 block text-slate-800 truncate">
                {stats.totalRevenue.toLocaleString()} <span className="text-sm font-normal text-slate-500">JD</span>
              </span>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl shrink-0">
              <FaMoneyBillWave className="text-2xl sm:text-3xl text-teal-600" />
            </div>
          </div>
        </div>

        {/* إجمالي الخصومات */}
        <div className="shadow-sm border border-slate-100 p-5 rounded-2xl bg-white hover:shadow-md transition-all duration-350">
          <div className="flex justify-between items-center gap-4">
            <div className="overflow-hidden">
              <h3 className="text-slate-500 text-xs sm:text-sm font-medium truncate">خصومات التأمين والمراجعين</h3>
              <span className="font-bold text-xl sm:text-2xl mt-2 block text-slate-800 truncate">
                {stats.totalDiscounts.toLocaleString()} <span className="text-sm font-normal text-slate-500">JD</span>
              </span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl shrink-0">
              <FaPercentage className="text-2xl sm:text-3xl text-amber-600" />
            </div>
          </div>
        </div>

        {/* إجمالي المرضى */}
        <div className="shadow-sm border border-slate-100 p-5 rounded-2xl bg-white hover:shadow-md transition-all duration-350">
          <div className="flex justify-between items-center gap-4">
            <div className="overflow-hidden">
              <h3 className="text-slate-500 text-xs sm:text-sm font-medium truncate">إجمالي المرضى المراجعين</h3>
              <span className="font-bold text-xl sm:text-2xl mt-2 block text-slate-800 truncate">
                {stats.totalPatients} <span className="text-sm font-normal text-slate-500">مريض</span>
              </span>
            </div>
            <div className="p-3 bg-cyan-50 rounded-xl shrink-0">
              <IoPeopleSharp className="text-2xl sm:text-3xl text-cyan-600" />
            </div>
          </div>
        </div>

        {/* عدد المواعيد المحجوزة */}
        <div className="shadow-sm border border-slate-100 p-5 rounded-2xl bg-white hover:shadow-md transition-all duration-350">
          <div className="flex justify-between items-center gap-4">
            <div className="overflow-hidden">
              <h3 className="text-slate-500 text-xs sm:text-sm font-medium truncate">عدد المواعيد المحجوزة</h3>
              <span className="font-bold text-xl sm:text-2xl mt-2 block text-slate-800 truncate">
                {stats.totalAppointments} <span className="text-sm font-normal text-slate-500">موعد</span>
              </span>
            </div>
            <div className="p-3 bg-sky-50 rounded-xl shrink-0">
              <FaCalendarCheck className="text-2xl sm:text-3xl text-sky-600" />
            </div>
          </div>
        </div>

      </div>

      {/* المخططات البيانية */}
      <div className="px-4 sm:px-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          {/* الـ overflow-x-auto يحمي الشارت من الخروج عن حدود الشاشة في الموبايل */}
          <Charts />
        </div>
      </div>
    </div>
  );
};

export default Statistics;