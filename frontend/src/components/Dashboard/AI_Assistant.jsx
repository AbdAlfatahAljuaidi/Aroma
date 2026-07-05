import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaMagic, FaUser, FaSearch, FaTimes } from 'react-icons/fa';
import { IoSparklesOutline } from "react-icons/io5";
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const AIAssistant = () => {
  // حالات إدارة الرسائل والاتصال بالباك-أند
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "مرحباً دكتور! أنا مساعدك الطبي الذكي. يرجى اختيار المريض عبر صندوق البحث العلوي ثم طرح أي استفسار يخص حالته الصحية ليتم تحليلها فوراً."
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // حالات إدارة المرضى والبحث
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(true);

  const chatEndRef = useRef(null);
  const dropdownRef = useRef(null); 

  // جلب قائمة المرضى عند تحميل الصفحة
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setPatientsLoading(true);
        const response = await axios.get(`${API_URL}/patients`);
        if (response.data.success) {
          const fetchedPatients = response.data.data || [];
          setPatients(fetchedPatients);
          if (fetchedPatients.length > 0) {
            setSelectedPatient(fetchedPatients[0]);
          }
        }
      } catch (err) {
        console.error("حدث خطأ أثناء جلب قائمة المرضى للـ AI:", err);
      } finally {
        setPatientsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // إغلاق قائمة البحث عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // التمرير التلقائي لأسفل الشات
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // تصفية المرضى بناءً على نص البحث
  const filteredPatients = patients.filter(p => 
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.digitalRecordNumber.toString().includes(searchTerm)
  );

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    
    const textToSend = inputMessage.trim();
    if (!textToSend) return;

    if (!selectedPatient) {
      alert("يرجى اختيار مريض أولاً لتتمكن من تحليل بياناته.");
      return;
    }

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        patientId: selectedPatient.id, 
        message: textToSend
      });

      if (response.data.success) {
        setMessages(prev => [
          ...prev, 
          { id: Date.now() + 1, sender: 'ai', text: response.data.aiReply }
        ]);
      }
    } catch (err) {
      console.error("خطأ أثناء استدعاء المساعد الذكي:", err);
      setMessages(prev => [
        ...prev, 
        { id: Date.now() + 1, sender: 'ai', text: "⚠️ عذراً دكتور، حدث خطأ أثناء معالجة التحليل الطبي. يرجى المحاولة مرة أخرى." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col text-right font-sans" dir="rtl">
      {/* الهيدر العلوي الذكي - متجاوب تماماً */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 md:p-6 bg-white border-b border-slate-200 shadow-sm gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-cyan-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-teal-100 shrink-0">
            <IoSparklesOutline className={isTyping ? "animate-spin" : "animate-pulse"} size={18} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">المساعد السريري الذكي (AI)</h1>
            <p className="text-slate-400 text-xs md:text-sm mt-0.5">تحليل ملفات المرضى وصياغة التنبيهات الفورية</p>
          </div>
        </div>
        
        {/* صندوق البحث الذكي البديل للـ Select - مرن ومتجاوب */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto relative" ref={dropdownRef}>
          <label className="text-xs font-bold text-slate-500 shrink-0 sm:mt-0 mt-1">الملف المستهدف:</label>
          
          <div className="relative w-full lg:min-w-[280px]">
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
              <FaSearch size={12} />
            </div>
            <input
              type="text"
              placeholder={patientsLoading ? "جاري التحميل..." : "ابحث باسم المريض أو الرقم..."}
              value={showDropdown ? searchTerm : (selectedPatient ? `👤 ${selectedPatient.patientName}` : "")}
              disabled={patientsLoading}
              onFocus={() => {
                setSearchTerm("");
                setShowDropdown(true);
              }}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // تصحيح: لا نمرر القيمة النصية مباشرة للـ selectedPatient لأنها تحتاج الكائن بالكامل عند الضغط
              }}
              className="w-full bg-slate-100 border border-slate-200 text-slate-700 pr-9 pl-8 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500 focus:bg-white shadow-sm transition-all"
            />
            {selectedPatient && !showDropdown && (
              <button 
                type="button"
                onClick={() => { setSelectedPatient(null); setShowDropdown(true); }}
                className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-red-500"
              >
                <FaTimes size={10} />
              </button>
            )}

            {/* القائمة المنسدلة الناتجة عن الفلترة */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                {filteredPatients.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400 text-center">لا توجد نتائج مطابقة</div>
                ) : (
                  filteredPatients.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPatient(p);
                        setShowDropdown(false);
                      }}
                      className={`w-full text-right px-4 py-2.5 text-xs font-medium border-b border-slate-50 last:border-0 block hover:bg-teal-50 hover:text-teal-700 transition-colors
                        ${selectedPatient?.id === p.id ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600'}`}
                    >
                      <div className="font-semibold">{p.patientName}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div className='hidden md:block'>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100 whitespace-nowrap self-start sm:self-auto hidden sm:inline-flex">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
            AI Active
          </span>
          </div>
        </div>
      </div>

      {/* منطقة جسم الشات والمحادثة - مرنة بحسب ارتفاع الشاشة المتاح */}
      <div className="py-4 md:py-6 flex flex-col h-[calc(100vh-190px)] md:h-[calc(100vh-150px)] min-h-0">
        
        {/* صندوق الرسائل المستقل مع التمرير الداخلي فقط */}
        <div className="flex-1 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 md:p-6 overflow-y-auto space-y-6 min-h-0 scrollbar-thin">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 md:gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <FaMagic size={13} />
                </div>
              )}
              <div className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-3.5 md:p-4 text-xs md:text-sm leading-relaxed whitespace-pre-line shadow-sm break-words
                ${msg.sender === 'user' 
                  ? 'bg-teal-600 text-white rounded-br-none shadow-teal-100' 
                  : 'bg-slate-50 text-slate-800 rounded-bl-none border border-slate-100'}`}>
                {msg.text}
                {msg.sender === 'user' && selectedPatient && (
                  <div className="text-[10px] text-teal-200 mt-1.5 pt-1 border-t border-teal-500/30">
                    تم الاستعلام عن ملف: {selectedPatient.patientName}
                  </div>
                )}
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <FaUser size={12} />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 md:gap-4 justify-start items-center">
              <div className="w-8 h-8 bg-slate-100 text-teal-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                <FaMagic size={13} className="animate-pulse" />
              </div>
              <div className="bg-slate-50 border border-slate-100 text-slate-400 text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm max-w-[85%]">
                <span className="flex gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
                <span className="truncate">جاري تحليل البيانات الطبية للمريض {selectedPatient?.patientName}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* نموذج إرسال الرسائل السفلي المتجاوب */}
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2 md:gap-3 shrink-0">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isTyping}
            placeholder={selectedPatient ? `اسأل عن ملف [${selectedPatient.patientName}]...` : "يرجى اختيار مريض أولاً من الأعلى"}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-teal-500 shadow-sm disabled:bg-slate-50"
          />
          <button 
            type="submit"
            disabled={isTyping || !inputMessage.trim() || !selectedPatient}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 md:px-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-teal-100 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:scale-100 whitespace-nowrap text-xs md:text-sm font-medium"
          >
            <span>إرسال</span>
            <FaPaperPlane size={11} className="transform rotate-180 hidden sm:inline-block" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;