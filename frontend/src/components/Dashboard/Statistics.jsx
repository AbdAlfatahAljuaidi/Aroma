import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyBillAlt } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import Charts from "./Charts";
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Statistics = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalProfit: 0,
    totalCustomers: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
           `${apiUrl}/api/statistics `
        );
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="p-6">جاري التحميل...</p>;

  return (
    <div className="bg-gray-50/20 min-h-screen">
      <h1 className="p-6 text-2xl font-bold shadow-md">
        لوحة التحكم
      </h1>

      <div className="m-8">
        <p className="text-2xl font-bold">
          نظرة عامة على لوحة التحكم
        </p>
        <p className="text-amber-800 text-xl">
          إليك ما يحدث في مقهاك اليوم
        </p>
      </div>

      <div className="md:grid grid-cols-4 px-8">

        {/* مجموع المبيعات */}
        <div className="shadow-md p-4 rounded-xl bg-white">
          <div className="flex justify-between items-center px-2 ">
            <div>
              <h1>مجموع المبيعات</h1>
              <span className="font-bold text-2xl mt-2 block">
                {stats.totalSales} JD
              </span>
            </div>
            <FaMoneyBillAlt className="text-4xl text-amber-800" />
          </div>
        </div>

        {/*  اجمالي الخصومات */}
        <div className="shadow-md p-4 rounded-xl bg-white mt-5 md:mt-0">
  <div className="flex justify-between items-center px-2">
    <div>
      <h1>إجمالي الخصومات</h1>
      <span className="font-bold text-2xl mt-2 block">
        {stats.totalDiscount} JD
      </span>
    </div>
    <FaMoneyBillAlt className="text-4xl text-amber-800" />
  </div>
 
</div>

        {/* عدد العملاء */}
        <div className="shadow-md p-4 rounded-xl bg-white mt-5 md:mt-0">
          <div className="flex justify-between items-center px-2">
            <div>
              <h1>عدد العملاء</h1>
              <span className="font-bold text-2xl mt-2 block">
                {stats.totalCustomers}
              </span>
            </div>
            <IoPerson className="text-4xl text-amber-800" />
          </div>
        </div>

        {/* عدد الطلبات */}
        <div className="shadow-md p-4 rounded-xl bg-white mt-5 md:mt-0">
          <div className="flex justify-between items-center px-2">
            <div>
              <h1>عدد الطلبات</h1>
              <span className="font-bold text-2xl mt-2 block">
                {stats.totalOrders}
              </span>
            </div>
            <FaMoneyBillAlt className="text-4xl text-amber-800" />
          </div>
        </div>

      </div>

      <Charts />
    </div>
  );
};

export default Statistics;