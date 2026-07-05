  import React, { useState } from 'react'
  import { FaCalendarPlus, FaUser, FaUserMd, FaClock, FaStethoscope, FaCheckCircle, FaTrashAlt, FaEdit } from 'react-icons/fa'

  const Book = () => {
    // حالات الـ Form (حقول الحجز الجديد)
    const [patientName, setPatientName] = useState('');
    const [doctorName, setDoctorName] = useState('د. سامر الخطيب');
    const [procedure, setProcedure] = useState('');
    const [time, setTime] = useState('');
    const [status, setStatus] = useState('قيد الانتظار');

    // دالة إضافة موعد جديد
    const handleBookAppointment = (e) => {
      e.preventDefault();
      if (!patientName || !procedure || !time) return;

      const newAppointment = {
        id: Date.now(),
        patientName,
        doctorName,
        procedure,
        time,
        status
      };

      setAppointments([newAppointment, ...appointments]);
      
      // إعادة تهيئة الحقول
      setPatientName('');
      setProcedure('');
      setTime('');
    };

    // دالة حذف موعد
    const handleDelete = (id) => {
      setAppointments(appointments.filter(app => app.id !== id));
    };

    return (
      <div className="bg-slate-50 min-h-screen p-6 md:p-8 text-right" dir="rtl">
        
        {/* 1. الهيدر العلوي */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaCalendarPlus className="text-teal-600" /> حجز وإدارة المواعيد
          </h1>
          <p className="text-slate-400 text-sm mt-1">قم بتنظيم مواعيد المرضى والأطباء والتحكم في حالات الحجز المتاحة</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 2. الـ Form (نموذج الحجز الجديد) */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">حجز موعد جديد</h3>
       
            <form onSubmit={handleBookAppointment} className="space-y-4">
              {/* اسم المريض */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">اسم المريض</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <FaUser size={14} />
                  </span>
                  <input 
                    type="text" 
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="مثال: محمد السعيد"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              {/* الطبيب المعالج */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">الطبيب المعالج</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <FaUserMd size={14} />
                  </span>
                  <select 
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-sm focus:outline-none focus:border-teal-500 appearance-none"
                  >
                    <option value="د. سامر الخطيب">د. سامر الخطيب (أسنان عام)</option>
                    <option value="د. رانيا المصري">د. رانيا المصري (علاج عصب)</option>
                    <option value="د. خالد منصور">د. خالد منصور (تقويم)</option>
                  </select>
                </div>
              </div>

              {/* نوع الإجراء الطبي */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">نوع الإجراء الطبي</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <FaStethoscope size={14} />
                  </span>
                  <input 
                    type="text" 
                    value={procedure}
                    onChange={(e) => setProcedure(e.target.value)}
                    placeholder="مثال: زراعة أسنان، فحص دوري"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              {/* وقت الموعد */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">وقت الموعد</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <FaClock size={14} />
                  </span>
                  <input 
                    type="text" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="مثال: 11:00 ص أو 04:30 م"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              {/* حالة الحجز */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">حالة الحجز البدئية</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                >
                  <option value="قيد الانتظار">⏳ قيد الانتظار</option>
                  <option value="مؤكد">✅ مؤكد</option>
                </select>
              </div>

              {/* زر الحجز */}
              <button 
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors mt-2 shadow-md shadow-teal-50"
              >
                تأكيد حجز الموعد
              </button>
            </form>
          </div>

          {/* 3. الجدول الحركي لعرض المواعيد */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">جدول مواعيد اليوم</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-sm">
                    <th className="pb-3 font-medium">اسم المريض</th>
                    <th className="pb-3 font-medium">الطبيب المعالج</th>
                    <th className="pb-3 font-medium">نوع الإجراء الطبي</th>
                    <th className="pb-3 font-medium">وقت الموعد</th>
                    <th className="pb-3 font-medium text-center">حالة الحجز</th>
                    <th className="pb-3 font-medium text-left">إجراءات سريعة</th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                  {appointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* اسم المريض */}
                      <td className="py-4 font-semibold text-slate-900">{app.patientName}</td>
                      
                      {/* الطبيب المعالج */}
                      <td className="py-4 text-slate-600 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        {app.doctorName}
                      </td>
                      
                      {/* نوع الإجراء */}
                      <td className="py-4 text-slate-500">{app.procedure}</td>
                      
                      {/* وقت الموعد */}
                      <td className="py-4 font-medium text-amber-600">{app.time}</td>
                      
                      {/* حالة الحجز */}
                      <td className="py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                          ${app.status === 'مؤكد' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {app.status}
                        </span>
                      </td>
                      
                      {/* إجراءات سريعة */}
                      <td className="py-4 text-left">
                        <div className="flex justify-end gap-2">
                          {/* زر تأكيد سريع للموعد المعلق */}
                          {app.status === 'قيد الانتظار' && (
                            <button 
                              onClick={() => {
                                setAppointments(appointments.map(a => a.id === app.id ? {...a, status: 'مؤكد'} : a))
                              }}
                              title="تأكيد الموعد"
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                            >
                              <FaCheckCircle size={14} />
                            </button>
                          )}
                          {/* زر حذف الموعد */}
                          <button 
                            onClick={() => handleDelete(app.id)}
                            title="حذف الموعد"
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <FaTrashAlt size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-400">لا توجد مواعيد محجوزة لهذا اليوم.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    )
  }

  export default Book;