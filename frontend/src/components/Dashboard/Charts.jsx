import React, { useState, useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';


const STATS_API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Charts = () => {
  // حالات إدارة البيانات والتحميل
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب البيانات من الباك-أند عند تحميل المكون
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${STATS_API_URL}/dashboard-stats`);
        
        if (response.data.success) {
          setChartData(response.data.data);
        } else {
          setError("فشل في تحميل البيانات من السيرفر");
        }
      } catch (err) {
        console.error("حدث خطأ أثناء جلب بيانات المخططات:", err);
        setError("حدث خطأ أثناء الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // 1. حالة التحميل
  if (loading) {
    return (
      <div className="mt-12 flex justify-center items-center h-48 text-slate-500 font-semibold">
        <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping ml-2"></span>
        جاري تحميل الإحصائيات المالية والخدمية...
      </div>
    );
  }

  // 2. حالة حدوث خطأ
  if (error) {
    return (
      <div className="mt-12 p-4 text-center bg-red-50 text-red-600 rounded-xl border border-red-100 mx-4">
        ⚠️ {error}. يرجى التحقق من اتصال السيرفر.
      </div>
    );
  }

  // تجهيز بيانات مخطط الخدمات (Bar Chart) من الباك-أند
  const barData = {
    labels: chartData?.servicesData?.labels || [], // مثل: ["تنظيف وتبييض", "حشوات تجميلية"]
    datasets: [
      {
        label: "صافي الإيرادات",
        data: chartData?.servicesData?.values || [], // مثل: [350, 600]
        backgroundColor: [
          "rgba(13, 148, 136, 0.85)", // Teal
          "rgba(6, 182, 212, 0.85)",  // Cyan
          "rgba(14, 165, 233, 0.85)", // Sky Blue
          "rgba(79, 70, 229, 0.85)"   // Indigo
        ],
        borderRadius: 8,
      }
    ]
  };

  // تجهيز بيانات مخطط النمو الشهري (Line Chart) من الباك-أند
  const lineData = {
    labels: chartData?.monthlyData?.labels || [], // مثل: ["الشهر الأول", "الشهر الثاني"]
    datasets: [
      {
        label: "مجموع الدخل الشهري",
        data: chartData?.monthlyData?.values || [], // مثل: [1400, 2300]
        borderColor: "rgb(13, 148, 136)",
        backgroundColor: "rgba(13, 148, 136, 0.1)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "rgb(6, 182, 212)",
        pointRadius: 5
      }
    ]
  };

  return (
    <div className='mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 px-4' dir="rtl">
      
      {/* المخطط الأول: العوائد حسب الخدمة الطبية */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <p className="text-slate-700 font-bold mb-4 text-center">الخدمات الأكثر طلباً (الربح بالـ JD)</p>
        {chartData?.servicesData?.values?.length > 0 ? (
          <Bar 
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              }
            }}
          />
        ) : (
          <p className="text-center text-xs text-slate-400 py-12">لا توجد بيانات خدمات متوفرة حالياً</p>
        )}
      </div>

      {/* المخطط الثاني: نمو المراجعين/الزيارات عبر الأشهر */}
      <div className='bg-white p-4 rounded-xl border border-slate-100 shadow-sm'>
        <p className="text-slate-700 font-bold mb-4 text-center">معدل الإيرادات الشهري</p>
        {chartData?.monthlyData?.values?.length > 0 ? (
          <Line 
            data={lineData}
            options={{
              responsive: true
            }}
          />
        ) : (
          <p className="text-center text-xs text-slate-400 py-12">لا توجد بيانات شهرية متوفرة حالياً</p>
        )}
      </div>

    </div>
  );
};

export default Charts;