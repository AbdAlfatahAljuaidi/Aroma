import React, { useState } from 'react'
import SideMenu from './SideMenu'
import Statistics from './Statistics'       // إحصائيات العيادة (المرضى، الدخل)
import Financials from './Financials'       // بدل Sales (المبيعات والأمور المالية)
import Appointments from './Appointments'   // بدل Orders (إدارة الحجوزات والمواعيد)
import Services from './Services'           // بدل Products (الخدمات الطبية: تبييض، زراعة...)
import MedicalSupplies from './MedicalSupplies' // بدل Materials (المواد الطبية المستهلكة)
import EquipmentInventory from './EquipmentInventory' // بدل Inventory (الأجهزة والمعدات)
import Patients from './Patients'           // بدل Clients (سجلات المرضى وملفاتهم)
import AI_Assistant from './AI_Assistant'   // الـ AI المساعد (مثلاً لتحليل المواعيد أو التشخيص الذكي)
import Doctor from './Doctor'

const Dashboard = () => {
  // الصفحة الافتراضية عند فتح اللوحة
  const [page, setPage] = useState("Statistics")

  return (
    <div className='min-h-screen bg-slate-50 md:grid grid-cols-[20%_80%] font-sans antialiased text-slate-800'>
      {/* القائمة الجانبية - رح نمرر لها المسميات الجديدة */}
      <SideMenu setPage={setPage} page={page} />
      
      {/* منطقة المحتوى الرئيسي */}
      <div className='p-6 overflow-y-auto h-screen'>
        
        {page === "Statistics" && <Statistics />}
        {page === "Financials" && <Financials />}
        {page === "Appointments" && <Appointments />}
        {page === "Services" && <Services />}
        {page === "MedicalSupplies" && <MedicalSupplies />}
        {page === "EquipmentInventory" && <EquipmentInventory />}
        {page === "Patients" && <Patients />}
        {page === "AI" && <AI_Assistant />}
        {page === "Doctor" && <Doctor />}
      </div>
    </div>
  )
}

export default Dashboard