import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// استيراد أيقونات طبية متناسقة
import { FaTooth, FaFileMedical, FaBoxes, FaRobot } from "react-icons/fa";
import { FaCalendarDays, FaStethoscope } from "react-icons/fa6";
import { IoAnalytics, IoPerson } from "react-icons/io5";
import { MdOutlineMedicalServices } from "react-icons/md";
import { PiSignOutBold as LogoutIcon } from "react-icons/pi";
import { HiOutlineMenu } from "react-icons/hi";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const SideMenu = ({ setPage, page }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); 
  
  // حالة جديدة لتخزين بيانات المستخدم الحالي
  const [currentUser, setCurrentUser] = useState({ name: "مستخدِم العيادة", role: "موظف" });

  const navigate = useNavigate();

  // جلب البيانات من الـ localStorage فور تحميل المكون
  useEffect(() => {
    const savedUser = localStorage.getItem("employeeUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.name) {
          setCurrentUser({
            name: parsedUser.name,
            // إذا كان الـ role راجع "employee" نحولها لنص عربي مناسب مثل "مسؤول النظام" أو "موظف"
            role: parsedUser.role === "doctor" ? "دكتور العيادة" : "مسؤول النظام"
          });
        }
      } catch (error) {
        console.error("خطأ في قراءة بيانات المستخدم من الـ localStorage", error);
      }
    }
  }, []);

  // تحديث المسميات والأيقونات لتناسب عيادة الأسنان بشكل احترافي
  const menuItems = [
    { name: "Statistics", icon: <IoAnalytics />, label: "لوحة التحكم" },
    { name: "Financials", icon: <FaFileMedical />, label: "المالية" },
    { name: "Appointments", icon: <FaCalendarDays />, label: "المواعيد" },
    { name: "Services", icon: <MdOutlineMedicalServices />, label: "الخدمات الطبية" },
    { name: "MedicalSupplies", icon: <FaBoxes />, label: "المستلزمات الطبية" },
    { name: "Doctor", icon: <FaStethoscope />, label: "الدكاترة" },
    { name: "Patients", icon: <IoPerson />, label: "سجلات المرضى" },
    { name: "AI", icon: <FaRobot />, label: "المساعد الذكي AI" },
  ];

  // دالة التعامل مع تسجيل الخروج
  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post(`${apiUrl}/Logout`);
      
      localStorage.removeItem("employeeUser");
      localStorage.removeItem("employeeToken");

      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/Login");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج، جاري التنظيف محلياً...");
      
      localStorage.removeItem("employeeUser");
      localStorage.removeItem("employeeToken");
      navigate("/Login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* زر فتح القائمة للهواتف */}
      <button
        className="md:hidden fixed top-4 right-4 bg-teal-600 text-white p-2 rounded-md z-50 shadow-md"
        onClick={() => setOpen(!open)}
      >
        <HiOutlineMenu size={24} />
      </button>

      {/* خلفية مظلمة عند فتح القائمة على الموبايل */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900 bg-opacity-40 z-40 md:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* القائمة الجانبية */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-slate-100 p-6 w-64 h-screen z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        {/* اللوجو والبراند للعيادة */}
        <div className="flex items-center mb-5 pb-4 border-b border-slate-100">
          <div className="bg-teal-600 text-white p-3 rounded-xl shadow-md text-xl">
            <FaTooth />
          </div>
          <div className="mr-3">
            <h1 className="font-bold text-xl text-slate-800 tracking-wide">دنتال كير</h1>
            <p className="text-slate-400 text-sm">نظام إدارة العيادة</p>
          </div>
        </div>

        <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">القائمة الرئيسية</h2>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => {
                setPage(item.name);
                setOpen(false);
              }}
              className={`flex items-center gap-3 text-base font-medium px-4 py-3 rounded-xl hover:cursor-pointer transition-all duration-200 ${
                page === item.name
                  ? "bg-teal-600 text-white shadow-md shadow-teal-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-teal-600"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </nav>

        {/* معلومات طبيب العيادة المسؤول المستخرجة ديناميكياً */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
          <div className="bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center text-slate-600">
            <IoPerson size={20} />
          </div>
          <div>
            {/* عرض الاسم والـ Role من الـ State الديناميكية */}
            <p className="font-semibold text-sm text-slate-800">{currentUser.name}</p>
            <p className="text-xs text-slate-400">{currentUser.role}</p>
          </div>
        </div>

        {/* زر تسجيل الخروج */}
        <button 
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full hover:cursor-pointer mt-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogoutIcon size={18} /> 
          {loading ? "جاري الخروج..." : "تسجيل الخروج"}
        </button>
      </div>
    </>
  );
};

export default SideMenu;