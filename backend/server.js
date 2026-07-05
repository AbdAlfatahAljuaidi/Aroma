const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose') // مستوردة بالفعل
const app = express()
require('dotenv').config()

// استدعاء الـ Routes
const financialRoutes = require('./routes/financial')
const bookAppointment = require('./routes/appointment')
const serviceRoutes = require('./routes/service')
const medicalSupplies = require('./routes/medicalSupplies')
const equipment = require('./routes/equipment')
const pateints = require('./routes/patients')
const ai = require('./routes/ai')
const statistics = require('./routes/statistics')
const dashboardStats = require('./routes/dashboardStats')
const doctorRoutes = require('./routes/doctorRoutes')
const signup = require('./routes/signup')
const login = require('./routes/login')
const whatsapp = require('./routes/whatsappMessage')


console.log("dsa");



// 1. تفعيل الـ CORS
app.use(cors({
    origin: process.env.ORIGIN || 'http://localhost:5173',
}))

// 2. قراءة الـ JSON
app.use(express.json())

// 3. الاتصال بقاعدة بيانات MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// 4. المسارات (Routes) - يُفضل توحيد البادئة بـ /api لتنظيم الكود
app.use('/', financialRoutes)
app.use('/', bookAppointment)
app.use('/', serviceRoutes)
app.use('/', medicalSupplies)
app.use('/', equipment)
app.use('/', pateints)
app.use('/', ai)
app.use('/', statistics)
app.use('/', dashboardStats)
app.use('/', doctorRoutes)
app.use('/', signup)
app.use('/', login)
app.use('/', whatsapp)

const PORT = process.env.PORT || 4000
app.listen(PORT , ()=>{
    console.log(`🚀 Server is Ready to take off on port ${PORT}`);
});