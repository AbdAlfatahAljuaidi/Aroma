import React, { useEffect, useState } from 'react';
import { FaPlus, FaCreditCard, FaMoneyBillWave, FaShieldAlt, FaChevronLeft, FaChevronRight, FaSearch, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const Financials = () => {
  // الحالات (States) الخاصة بنموذج الإدخال السريع
  const [type, setType] = useState('income'); 
  const [name, setName] = useState(''); // سيحمل اسم المورد في حال المصاريف
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [method, setMethod] = useState('كاش'); 

  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

  // حالات إدارة اختيار المرضى والفلترة
  const [patientsList, setPatientsList] = useState([]); // قائمة جميع المرضى من الباك-أند
  const [selectedPatient, setSelectedPatient] = useState(null); // المريض الذي تم اختياره
  const [patientSearch, setPatientSearch] = useState(''); // نص البحث داخل قائمة المرضى
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [isNewProcedure, setIsNewProcedure] = useState(false); // هل المعاملة إجراء جديد يرفع التكلفة؟

  // مصفوفة المعاملات المالية المجلوبة من السيرفر
  const [transactions, setTransactions] = useState([]);

  const employee = JSON.parse(localStorage.getItem("employeeUser"));
  const employeeName = employee?.name;

  // حالات الـ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API_URL}/patients`);
      if (response.data.success) {
        setPatientsList(response.data.data || []);
      }
    } catch (error) {
      console.error("خطأ في جلب قائمة المرضى:", error);
    }
  };

  const fetchFinancialRecords = async () => { 
    try {
      const { data } = await axios.post(`${API_URL}/getFinancialRecords`);
      if(data.error === false) {
        setTransactions(data.data.map(record => ({
          id: record.id,
          patient: record.name,
          service: record.description,
          amount: record.amount,
          type: record.type, 
          method: record.method,
          employeeName: record.employeeName || employeeName,
          date: record.date?.seconds 
            ? new Date(record.date.seconds * 1000).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0] 
        })));
      }
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  // تصفية المرضى بناءً على بحث المستخدم في القائمة المنسدلة
  const filteredPatientsInDropdown = patientsList.filter(p => 
    p.patientName.toLowerCase().includes(patientSearch.toLowerCase())
  );

  // دالة إضافة معاملة مالية جديدة وتحديث سجل المريض
  const createPayment = async () => {
    const finalName = type === 'income' ? selectedPatient?.patientName : name;

    if (!finalName || !amount || !method || !employeeName) {
      return toast.warn("يرجى ملء جميع الحقول المطلوبة واختيار المريض/الجهة", {
        className: "!text-black !bg-white border border-teal-600",
        progressClassName: "!bg-teal-300", 
      });
    }

    try {
      const { data } = await axios.post(`${API_URL}/createPayment`, {
        type, 
        name: finalName,
        amount: Number(amount), 
        description,
        method,
        employeeName,
        patientId: type === 'income' ? selectedPatient?.id : null,
        isNewProcedure: type === 'income' ? isNewProcedure : false 
      });

      if (data.error === false) {
        toast.success(data.message,{
          className: "!text-black !bg-white border border-teal-600",
          progressClassName: "!bg-teal-300",
        });
        
        const newTx = {
          id: Date.now(),
          patient: finalName,
          service: description || (type === 'income' ? 'إيراد داخلي' : 'مصاريف تشغيلية'),
          amount: Number(amount),
          type: type, 
          method: method,
          employeeName: employeeName,
          date: new Date().toISOString().split('T')[0] 
        };
        
        if(!isNewProcedure) {
          setTransactions([newTx, ...transactions]);
          setCurrentPage(1); 
        }

        setName('');
        setSelectedPatient(null);
        setPatientSearch('');
        setAmount('');
        setDescription('');
        setIsNewProcedure(false);
        fetchPatients(); 
        fetchFinancialRecords();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء الاتصال بالسيرفر");
    }
  };

  // دالة تصدير البيانات إلى Excel
  const exportToExcel = () => {
    if (transactions.length === 0) {
      return toast.info("لا توجد بيانات لتصديرها");
    }

    const excelData = transactions.map(tx => ({
      'البيان / المريض': tx.patient,
      'الموظف المسؤول': tx.employeeName || '',
      'نوع المعاملة': tx.type === 'income' || tx.type === 'ايراد داخلي' ? 'دخل / إيراد' : 'مصروف',
      'الإجراء / الخدمة': tx.service || '',
      'طريقة الدفع': tx.method,
      'التاريخ': tx.date,
      'المبلغ (JD)': tx.amount
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    
    // إعداد اتجاه الصفحة من اليمين إلى اليسار لدعم اللغة العربية
    if (!worksheet['!views']) worksheet['!views'] = [{}];
    worksheet['!views'][0].RTL = true;

    XLSX.utils.book_append_sheet(workbook, worksheet, "التقرير المالي");
    XLSX.writeFile(workbook, `التقرير_المالي_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("تم تصدير ملف Excel بنجاح");
  };

 
  // الحسابات الديناميكية للشهر الحالي
  const currentYearMonth = new Date().toISOString().slice(0, 7); 

  const monthlyIncome = transactions
    .filter(tx => (tx.date && tx.date.startsWith(currentYearMonth)) && (tx.type === 'income' || tx.type === 'ايراد داخلي'))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyExpense = transactions
    .filter(tx => (tx.date && tx.date.startsWith(currentYearMonth)) && (tx.type === 'expense' || tx.type === 'مصاريف'))
    .reduce((sum, tx) => sum + tx.amount, 0);

  // منطق تقسيم الصفحات
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const [servicesList, setServicesList] = useState([]); 
  const [selectedService, setSelectedService] = useState(''); 

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/services`); 
        const result = await response.json();
        if (result.success) {
          setServicesList(result.data);
        }
      } catch (error) {
        console.error("خطأ في جلب الخدمات الطبية:", error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    fetchFinancialRecords();
    fetchPatients();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-10 text-right font-sans" dir="rtl">
      {/* الهيدر العلوي */}
      <div className="pt-6 px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 sm:p-6 rounded-2xl bg-white border border-slate-150 shadow-sm gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">الإدارة المالية</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">تتبع التدفقات النقدية، تحديث فواتير وأقساط المرضى تلقائياً</p>
          </div>
          {/* أزرار التصدير والطباعة الجديدة */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors shadow-sm"
            >
              <FaFileExcel size={14} />
              تصدير Excel
            </button>
          
          </div>
        </div>
      </div>

      {/* كروت الملخص المالي */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-8">
        {/* إجمالي المقبوضات */}
        <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-2xl shadow-sm flex items-center justify-between gap-4">
          <div className="overflow-hidden">
            <p className="text-slate-400 text-xs sm:text-sm font-medium truncate">إجمالي المقبوضات الشهرية</p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1 truncate">{monthlyIncome.toLocaleString()} JD</h3>
            <span className="text-emerald-600 text-[11px] sm:text-xs font-semibold flex items-center gap-1 mt-2">
              <MdArrowUpward className="shrink-0" /> إيرادات شهر {new Date().getMonth() + 1} الحالي
            </span>
          </div>
          <div className="p-3 sm:p-4 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0"><MdArrowUpward size={22} /></div>
        </div>

        {/* المصاريف والمستلزمات */}
        <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-2xl shadow-sm flex items-center justify-between gap-4">
          <div className="overflow-hidden">
            <p className="text-slate-400 text-xs sm:text-sm font-medium truncate">المصاريف والمستلزمات</p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1 truncate">{monthlyExpense.toLocaleString()} JD</h3>
            <span className="text-rose-600 text-[11px] sm:text-xs font-semibold flex items-center gap-1 mt-2">
              <MdArrowDownward className="shrink-0" /> مصاريف شهر {new Date().getMonth() + 1} الحالي
            </span>
          </div>
          <div className="p-3 sm:p-4 bg-rose-50 text-rose-600 rounded-2xl shrink-0"><MdArrowDownward size={22} /></div>
        </div>

        {/* مطالبات التأمين */}
        <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-2xl shadow-sm flex items-center justify-between gap-4 sm:col-span-2 lg:col-span-1">
          <div className="overflow-hidden">
            <p className="text-slate-400 text-xs sm:text-sm font-medium truncate">مطالبات تأمين (قيد الانتظار)</p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1 truncate">890 JD</h3>
            <span className="text-blue-600 text-[11px] sm:text-xs font-semibold flex items-center gap-1 mt-2">3 شركات تأمين نشطة</span>
          </div>
          <div className="p-3 sm:p-4 bg-blue-50 text-blue-600 rounded-2xl shrink-0"><FaShieldAlt size={22} /></div>
        </div>
      </div>

      {/* قسم الجداول والتسجيل السريع */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-8">
        {/* جدول العمليات المالية */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">آخر العمليات المالية</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="w-full text-right border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs sm:text-sm">
                      <th className="pb-3 font-medium">البيان / المريض</th>
                      <th className="pb-3 font-medium">الموظف</th>
                      <th className="pb-3 font-medium">نوع الحركة</th>
                      <th className="pb-3 font-medium">طريقة الدفع</th>
                      <th className="pb-3 font-medium">التاريخ</th>
                      <th className="pb-3 font-medium text-left">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs sm:text-sm text-slate-700">
                    {currentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 font-medium text-slate-900">{tx.patient}</td>
                        <td className="py-3.5 text-slate-600">{tx.employeeName}</td>
                        <td className="py-3.5 text-slate-500">
                          {tx.type === "income" || tx.type === "ايراد داخلي" ? "دخل" : "مصروف"}
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium
                            ${tx.method === 'كاش' ? 'bg-amber-50 text-amber-700' : 
                              tx.method === 'بطاقة' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                            {tx.method === 'كاش' && <FaMoneyBillWave size={11} />}
                            {tx.method === 'بطاقة' && <FaCreditCard size={11} />}
                            {tx.method === 'تأمين' && <FaShieldAlt size={11} />}
                            {tx.method}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-400">{tx.date}</td>
                        <td className={`py-3.5 font-bold text-left ${tx.type === 'income' || tx.type === 'ايراد داخلي' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.type === 'income' || tx.type === 'ايراد داخلي' ? `+${tx.amount}` : `-${tx.amount}`} JD
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* الباجينيشن */}
          {transactions.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-4 mt-6 gap-4">
              <div className="text-xs text-slate-400 font-medium text-center sm:text-right">
                عرض {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, transactions.length)} من أصل {transactions.length} معاملة
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30"><FaChevronRight size={11} /></button>
                <div className="flex items-center gap-1 max-w-[180px] overflow-x-auto py-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 shrink-0 rounded-xl text-xs font-semibold ${currentPage === i + 1 ? 'bg-slate-900 text-white' : 'border border-slate-200'}`}>{i + 1}</button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30"><FaChevronLeft size={11} /></button>
              </div>
            </div>
          )}
        </div>

        {/* كرت تسجيل حركة مادية جديدة */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sm:p-6 h-fit overflow-visible">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">تسجيل حركة سريعة</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">نوع المعاملة</label>
              <select 
                value={type} 
                onChange={(e) => { 
                  setType(e.target.value); 
                  setSelectedPatient(null); 
                  setSelectedService('');
                  setAmount('');
                  if(setIsNewProcedure) setIsNewProcedure(false);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-teal-500"
              >
                <option value="income">إيراد داخلي (مريض/دفعة)</option>
                <option value="expense">مصاريف تشغيلية / مستلزمات</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                {type === 'income' ? 'اختر المريض من المنظومة' : 'الجهة / المورد'}
              </label>

              {type === 'income' ? (
                <>
                  <div 
                    onClick={() => setShowPatientDropdown(!showPatientDropdown)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm cursor-pointer flex justify-between items-center text-slate-700"
                  >
                    {selectedPatient ? (
                      <span className="truncate">
                        {selectedPatient.patientName} <b className="text-[11px] text-amber-600 font-normal sm:font-bold">(متبقي عليه: {selectedPatient.financialRecord?.remainingDebt || 0} JD)</b>
                      </span>
                    ) : (
                      <span className="text-slate-400">انقر لاختيار المريض...</span>
                    )}
                  </div>

                  {showPatientDropdown && (
                    <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-lg max-h-60 overflow-y-auto p-2 space-y-2">
                      <div className="relative flex items-center">
                        <input 
                          type="text" 
                          placeholder="ابحث عن مريض..."
                          value={patientSearch}
                          onChange={(e) => setPatientSearch(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg pr-8 pl-3 py-1.5 text-xs focus:outline-none"
                        />
                        <FaSearch className="absolute right-2.5 text-slate-400" size={10} />
                      </div>
                      <div className="divide-y divide-slate-50">
                        {filteredPatientsInDropdown.map(p => (
                          <div 
                            key={p.id}
                            onClick={() => { setSelectedPatient(p); setShowPatientDropdown(false); }}
                            className="p-2 hover:bg-teal-50 text-xs rounded-lg cursor-pointer flex justify-between items-center gap-2"
                          >
                            <span className="font-medium text-slate-800 truncate">{p.patientName}</span>
                            <span className="text-slate-400 text-[10px] shrink-0">الديون: {p.financialRecord?.remainingDebt || 0} JD</span>
                          </div>
                        ))}
                        {filteredPatientsInDropdown.length === 0 && (
                          <p className="text-center text-xs text-slate-400 py-2">لا يوجد نتائج تطابق البحث</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedPatient && (
                    <div className="mt-3 flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 transition-all">
                      <input 
                        type="checkbox" 
                        id="isNewProcedure"
                        checked={isNewProcedure} 
                        onChange={(e) => setIsNewProcedure(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                      <label htmlFor="isNewProcedure" className="text-[11px] font-medium text-slate-700 cursor-pointer select-none leading-normal">
                        {isNewProcedure ? (
                          <span className="text-amber-600 font-semibold">⚠️ سيتم إضافة المبلغ على دين المريض (إجراء جديد)</span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">✅ سيتم خصم المبلغ من مستحقات المريض (تسديد دفعة)</span>
                        )}
                      </label>
                    </div>
                  )}
                </>
              ) : (
                <input 
                  value={name}
                  onChange={(e) => setName(e.target.value)} 
                  type="text" 
                  placeholder="مثال: شركة مستلزمات الأسنان، فاتورة الكهرباء" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-teal-500" 
                />
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">الإجراء / البيان (الخدمة)</label>
              {type === 'income' ? (
                <select 
                  value={selectedService} 
                  onChange={(e) => {
                    const serviceId = e.target.value;
                    setSelectedService(serviceId);
                    
                    const service = servicesList.find(s => s.id === serviceId);
                    if (service) {
                      setAmount(service.basePrice); 
                      setDescription(service.serviceName); 
                    } else {
                      setAmount('');
                      setDescription('');
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                >
                  <option value="">-- اختر الخدمة الطبية --</option>
                  {servicesList.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.serviceName} ({service.basePrice} JD)
                    </option>
                  ))}
                </select>
              ) : (
                <input 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} 
                  type="text" 
                  placeholder="مثال: شراء مواد حشوات، صيانة جهاز" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-teal-500" 
                />
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                {isNewProcedure ? "إجمالي تكلفة الإجراء الجديد (ينزل كدين)" : "المبلغ المدفوع نقداً (JD)"}
              </label>
              <input 
                value={amount}
                onChange={(e) => setAmount(e.target.value)} 
                type="number" 
                placeholder="0.00" 
                className={`w-full border rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none 
                  ${isNewProcedure ? 'bg-amber-50/60 border-amber-200 focus:border-amber-500 text-amber-900' : 'bg-slate-50 border-slate-200 focus:border-teal-500'}`} 
              />
            </div>

            <div className={isNewProcedure && Number(amount) > 0 ? "opacity-50 pointer-events-none" : ""}>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">طريقة الدفع للمبلغ النقدي</label>
              <div className="grid grid-cols-3 gap-2 text-center pt-3">
                {['كاش', 'بطاقة', 'تأمين'].map(m => (
                  <label key={m} className={`border rounded-xl p-2 text-[11px] sm:text-xs font-medium cursor-pointer transition-colors block ${method === m ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input type="radio" name="method" checked={method === m} onChange={() => setMethod(m)} className="hidden" /> {m}
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={createPayment} 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm transition-colors mt-2"
            >
              {isNewProcedure ? "تسجيل مديونية وتحديث ملف المريض" : "حفظ المعاملة المالية وتحديث السجلات"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Financials;