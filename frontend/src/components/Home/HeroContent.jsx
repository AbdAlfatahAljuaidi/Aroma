import React from 'react'
import { FaHeartbeat, FaCalendarCheck, FaNotesMedical } from "react-icons/fa";

const HeroContent = () => {
  return (
    <div className='md:flex items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 md:w-[50%] relative overflow-hidden' dir="rtl">
      
      {/* تأثير ضوئي خافت بالخلفية متناسق مع لون الـ Teal الرئيسي */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className='mx-8 md:mx-12 text-white relative z-10 py-12 md:py-0'>
        
        {/* هيدر وشعار السيستم بالـ Teal المتوهج */}
        <div className='flex items-center gap-3 transition-all duration-300 hover:translate-x-[-4px] w-fit cursor-pointer'>
          <div className='bg-gradient-to-tr from-teal-500 to-emerald-400 p-3 rounded-2xl shadow-xl shadow-teal-500/20 flex items-center justify-center'>
            <FaHeartbeat className='text-xl text-slate-950' />
          </div>
          <div>
            <h1 className='font-black text-xl tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent'>
              جيرومكس
            </h1>
            <p className='text-[10px] text-teal-400 font-medium tracking-widest uppercase mt-0.5'>Smart Clinic Suite</p>
          </div>
        </div>

        {/* العنوان الرئيسي الاحترافي مع دمج اللون الرئيسي */}
        <h2 className='font-extrabold text-3xl md:text-5xl mt-16 md:mt-12 leading-[1.25] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent'>
          أدر عيادتك الذكية <br />
          <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">بكفاءة واحترافية</span> رقمية
        </h2>

        {/* الوصف العام */}
        <p className='text-slate-400/90 mt-6 text-sm md:text-base leading-relaxed max-w-xl font-light'>
          النظام السحابي المتكامل لإدارة المراكز الطبية الحديثة. نظّم مواعيد المرضى، تتبع السجلات الصحية بدقة، وراقب مؤشرات الأداء والتحليلات الذكية عبر شاشة تحكم واحدة آمنة وسهلة الاستخدام.
        </p>

        {/* بطاقات المميزات بتصميم زجاجي عصري متناسق مع الـ Teal */}
        <section className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-12 border-t border-slate-800/60 pt-8'>
          
          {/* الميزة الأولى */}
          <div className='group p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl transition-all duration-300 hover:bg-white/[0.04] hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/5'>
            <div className='w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-teal-500 group-hover:text-slate-950 shadow-inner'>
              <FaCalendarCheck size={16} />
            </div>
            <h3 className='mt-4 font-bold text-base text-slate-100 group-hover:text-teal-400 transition-colors duration-300'>
              جدولة مواعيد مرنة
            </h3>
            <p className='text-slate-400 mt-2 text-xs leading-relaxed font-light'>
              حجز وإدارة مواعيد المرضى بسلاسة مع توزيع ذكي وتلقائي على الأطباء لتفادي الازدحام وتقليص وقت الانتظار.
            </p>
          </div>

          {/* الميزة الثانية */}
          <div className='group p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl transition-all duration-300 hover:bg-white/[0.04] hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5'>
            <div className='w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-slate-950 shadow-inner'>
              <FaNotesMedical size={16} />
            </div>
            <h3 className='mt-4 font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors duration-300'>
              السجلات الطبية الرقمية
            </h3>
            <p className='text-slate-400 mt-2 text-xs leading-relaxed font-light'>
              حفظ وتتبع التاريخ المرضي الشامل، الوصفات الطبية الإلكترونية، والتقارير المخبرية لكل مريض بأعلى معايير الأمان.
            </p>
          </div>

        </section>
      </div>
    </div>
  )
}

export default HeroContent