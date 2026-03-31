import React, { useState } from "react";
import { FaCoffee, FaWarehouse,FaRobot  } from "react-icons/fa";
import { BsBarChart } from "react-icons/bs";
import { IoAnalytics, IoPerson } from "react-icons/io5";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { FaBox } from "react-icons/fa6";
import { LuPackage } from "react-icons/lu";
import { PiSignOutBold } from "react-icons/pi";
import { HiOutlineMenu } from "react-icons/hi";
import { Link } from "react-router-dom";


const SideMenu = ({ setPage, page }) => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Statistics", icon: <IoAnalytics />, label: "لوحة التحكم" },
    { name: "Sales", icon: <BsBarChart />, label: "البيع" },
    { name: "Orders", icon: <HiOutlineShoppingCart />, label: "الطلبات" },
    { name: "Products", icon: <FaBox />, label: "المنتجات" },
    { name: "Materials", icon: <LuPackage />, label: "مواد الخام" },
    { name: "Inventory", icon: <FaWarehouse />, label: "المخزون" },
    { name: "AI", icon: <FaRobot  />, label: "الذكاء الاصطناعي" },
  ];

  return (
    <>
      {/* زر فتح القائمة للهواتف */}
      <button
        className="lg:hidden fixed top-4 left-4 bg-primary text-white p-2 rounded-md z-50"
        onClick={() => setOpen(true)}
      >
        <HiOutlineMenu size={24} />
      </button>

      {/* خلفية مظلمة عند فتح القائمة */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* القائمة الجانبية */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md p-6 w-64 z-50 transform transition-transform duration-300
        ${open ? "translate-x-0 " : "-translate-x-full w-full"} lg:translate-x-0 lg:static lg:block`}
      >
        {/* Logo */}
        <div className="flex items-center mb-10">
          <h1 className="bg-amber-800 text-white px-2 py-2 shadow-md text-xl">
            <FaCoffee />
          </h1>
          <div className="mr-4">
            <h1 className="font-bold text-2xl">أروما</h1>
            <p className="text-gray-500 text-lg">نظام الادارة</p>
          </div>
        </div>

        <h1 className="md:mt-10 text-amber-800 text-2xl font-bold">القائمة</h1>
        <nav className="mt-7 space-y-3">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => {
                setPage(item.name);
                setOpen(false); // يغلق القائمة على الهواتف عند اختيار صفحة
              }}
              className={`flex items-center text-xl px-3 py-1 rounded-lg hover:cursor-pointer transition-all duration-300 ${
                page === item.name
                  ? "bg-amber-800 text-white"
                  : ""
              }`}
            >
              {item.icon}
              <span className="mr-2">{item.label}</span>
            </li>
          ))}
        </nav>

        {/* معلومات المستخدم */}
        <div className="md:mt-10 mt-5 flex items-center">
          <IoPerson className="bg-gray-200 w-10 h-10 rounded-full px-2 py-2" />
          <div className="text-md">
            <p className="mr-2">Aroma</p>
          </div>
        </div>

        <button className="flex items-center justify-center w-full mt-2 border rounded-md hover:scale-105 transition-all duration-300">
          <PiSignOutBold className="ml-2" /> تسجيل الخروج
        </button>
      </div>
    </>
  );
};

export default SideMenu;