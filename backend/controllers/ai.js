const { GoogleGenAI } = require("@google/genai");
const Patient = require('../models/Patient'); // استدعاء موديل المرضى الخاص بـ MongoDB

// إعداد مكتبة Gemini الـ SDK الرسمية الجديدة
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

/**
 * دالة تحليل بيانات المريض والإجابة على الاستفسارات الطبية/الإدارية والمالية حركياً (MongoDB Version)
 */
exports.analyzePatientChat = async (req, res) => {
  try {
    const { patientId, message } = req.body;
    
console.log("Received request for patientId: ",req.body);

    if (!patientId || !message) {
      return res.status(400).json({
        success: false,
        message: "يرجى إرسال معرف المريض (patientId) ونص الاستفسار (message)"
      });
    }

    // 1. جلب بيانات المريض الحقيقية والحالية من الـ MongoDB باستخدام الـ ID
    const patientData = await Patient.findById(patientId);

    if (!patientData) {
      return res.status(404).json({
        success: false,
        message: "لم يتم العثور على ملف هذا المريض في المنظومة"
      });
    }
    
    // استخراج الكائن المالي مع وضع قيم افتراضية لسلامة النظام من هيكلية المونجو
    const financial = patientData.financialRecord || {
      totalCost: 0,
      totalPaid: 0,
      remainingDebt: 0,
      paymentsHistory: []
    };

    // تحويل مصفوفة تاريخ الدفعات إلى نص منسق يفهمه الـ AI
    const formattedHistory = financial.paymentsHistory && financial.paymentsHistory.length > 0
      ? financial.paymentsHistory.map((p, idx) => `  - دفعة رقم ${idx + 1}: مبلغ ${p.amount} JD بواسطة [${p.method}] لبيان: (${p.description}) بتاريخ ${p.date}`).join('\n')
      : "  - لا يوجد دفعات مسجلة مسبقاً بعد.";

    // 2. بناء سياق طبي ومالي صارم ودقيق بناءً على بيانات الـ Document المسترجع من MongoDB
    const MEDICAL_CONTEXT = `
أنت الآن المساعد الطبي والمالي الذكي لعيادة الأسنان المتكاملة. وظيفتك هي تحليل سجل المريض ومساعدة الطبيب أو موظف الاستقبال بالمعلومات المتاحة فقط في ملفه الرقمي الحالي.

بيانات المريض الحالية في النظام:
- اسم المريض: ${patientData.patientName}
- العمر: ${patientData.age} سنة
- رقم الهاتف: ${patientData.phone}
- تاريخ آخر زيارة للعيادة: ${patientData.lastVisit}
- التنبيهات الطبية الحرجة (Medical Alert): ${patientData.medicalAlert}
- الملاحظات السريرية وتفاصيل الحالة (Clinical Notes): ${patientData.clinicalNotes || "غير مدرجة"}

الملف المالي التفصيلي الحالي للمريض:
- التكلفة الإجمالية لجميع العلاجات (Total Cost): ${financial.totalCost} دينار أردني (JD).
- إجمالي المبالغ المدفوعة حتى الآن (Total Paid): ${financial.totalPaid} دينار أردني (JD).
- المتبقي عليه كديون مستحقة للعيادة (Remaining Debt): ${financial.remainingDebt} دينار أردني (JD).

سجل وتاريخ الدفعات المالية السابقة للمريض:
${formattedHistory}
`;

    // 3. دمج السياق الطبي مع سؤال المستخدم في الـ Prompt
    const prompt = `
${MEDICAL_CONTEXT}

الاستفسار المطلوب الإجابة عليه أو تحليله: "${message}"

تعليمات صارمة للمساعد الذكي:
1. أجب بلغة عربية مهنية، واضحة وموجزة تلائم الطاقم الطبي والإداري بالعيادة.
2. إذا كان الاستفسار يتعلق بإجراء علاجي، قم بالتحذير فوراً بناءً على حقل "التنبيهات الطبية الحرجة" و"الملاحظات السريرية".
3. إذا سئلت عن وضع المريض المالي, استخدم الأرقام الدقيقة (التكلفة الإجمالية، المدفوع، المتبقي عليه) واشرح تاريخ دفعاته بوضوح عند الحاجة.
4. اعتمد تماماً على البيانات الممررة أعلاه ولا تخترع معلومات طبية أو مالية خارجة عن سياق هذا الملف الرقمي نهائياً.
5. إذا طلب المستخدم معلومات غير متوفرة في السجل، قل بأدب: "هذه المعلومة غير مدرجة في السجل الرقمي الحالي للمريض".
`;

    // 4. استدعاء نموذج Gemini 2.5 Flash لمعالجة البيانات
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });


    // 5. إرجاع التحليل الطبي والمالي الذكي للفرونت-أند
    return res.status(200).json({
      success: true,
      patientName: patientData.patientName,
      aiReply: response.text
    });

  } catch (error) {
    console.error("حدث خطأ في النظام الطبي الذكي:", error);
    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء معالجة البيانات وتحليلها عبر الذكاء الاصطناعي",
      error: error.message
    });
  }
};