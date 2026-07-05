const Payment = require('../models/Payment'); // استدعاء موديل الحركات المالية لـ MongoDB

exports.getDashboardChartData = async (req, res) => {
    try {
        // 1. جلب كافة فواتير الدخل فقط من كوليكشن payments في MongoDB
        const paymentsData = await Payment.find({ type: 'income' });
        
        // كائنات مؤقتة لتجميع البيانات حركياً
        const servicesMap = {}; // لتجميع الدخل لكل خدمة مثل: {"تقويم أسنان": 1200}
        const monthlyMap = {};  // لتجميع الدخل لكل شهر مثل: {"مايو": 1400}

        // المصفوفة العربية لأسماء الأشهر
        const monthsNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

        paymentsData.forEach(doc => {
            const amount = parseFloat(doc.amount) || 0;

            // ---- أولاً: تجميع الإيرادات حسب نوع الخدمة ----
            // نعتمد على حقل الوصف (description) لتحديد اسم الخدمة، أو نضع قيمة افتراضية
            const service = doc.description || "خدمات عامة"; 
            if (servicesMap[service]) {
                servicesMap[service] += amount;
            } else {
                servicesMap[service] = amount;
            }

            // ---- ثانياً: تجميع الإيرادات حسب الشهر الفعلي ----
            // نعتمد على تاريخ الفاتورة المخزن تلقائياً بواسطة المونجو في حقل createdAt أو date التاريخي
            let monthLabel = "غير محدد";
            const dateObj = doc.date || doc.createdAt;

            if (dateObj) {
                const monthIndex = new Date(dateObj).getMonth(); // يعطي رقماً من 0 لـ 11
                monthLabel = monthsNames[monthIndex];
            } else {
                // في حال عدم وجود تاريخ، نضع الشهر الحالي كافتراضي
                monthLabel = monthsNames[new Date().getMonth()];
            }

            if (monthlyMap[monthLabel]) {
                monthlyMap[monthLabel] += amount;
            } else {
                monthlyMap[monthlyMap] = amount;
                monthlyMap[monthLabel] = amount;
            }
        });

        // 2. تحويل كائنات التجميع (Maps) إلى التنسيق المصفوفي (Arrays) الذي يتوقعه الـ Chart بالفرونت إند
        
        // إعداد بيانات الخدمات (Bar Chart / Pie Chart)
        const servicesLabels = Object.keys(servicesMap);
        const servicesValues = Object.values(servicesMap);

        // إعداد بيانات المخطط الشهري (Line Chart) مرتبة منطقياً حسب ترتيب مصفوفة الأشهر الأساسية
        const monthlyLabels = monthsNames.filter(m => monthlyMap[m] !== undefined);
        const monthlyValues = monthlyLabels.map(m => monthlyMap[m]);

        // 3. تأمين بيانات افتراضية (Mock Data) في حال كانت الداتابيز جديدة وفارغة لتفادي اختفاء الشارت بالفرونت
        const responseData = {
            servicesData: {
                labels: servicesLabels.length > 0 ? servicesLabels : ["تنظيف وتبييض", "حشوات تجميلية", "علاج عصب", "زراعة أسنان"],
                values: servicesValues.length > 0 ? servicesValues : [450, 780, 1200, 2100]
            },
            monthlyData: {
                labels: monthlyLabels.length > 0 ? monthlyLabels : ["مارس", "أبريل", "مايو", "يونيو"],
                values: monthlyValues.length > 0 ? monthlyValues : [1200, 1850, 2400, 3500]
            }
        };

        return res.status(200).json({
            success: true,
            data: responseData
        });

    } catch (error) {
        console.error("Error generating chart data:", error);
        return res.status(500).json({
            success: false,
            message: "حدث خطأ داخلي في الخادم أثناء تجميع بيانات المخططات",
            error: error.message
        });
    }
};