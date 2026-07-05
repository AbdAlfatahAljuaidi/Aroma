import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home/Home'
import Signup from './components/Register/Signup'
import Login from './components/Register/Login'
import Dashboard from './components/Dashboard/Dashboard'  

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // تأكد من استيراد الـ CSS الخاص بالـ toast لو مش مستورد بمكان ثاني
import AddMaterial from './components/Dashboard/AddMaterial'
import AddInventory from './components/Dashboard/AddInventory'
import AddProducts from './components/Dashboard/AddProducts'
import Book from './components/Dashboard/Book'
import AddService from './components/Dashboard/AddService'
import AddSupplies from './components/Dashboard/AddSupplies'
import MedicalSupplies from './components/Dashboard/MedicalSupplies'
import AddEquipment from './components/Dashboard/AddEquipment'
import AddPatient from './components/Dashboard/AddPatient'
import UpdatePatient from './components/Dashboard/UpdatePatient'
import Doctor from './components/Dashboard/Doctor'

// ================= مكون حماية المسارات (Protected Route) =================
const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('employeeUser');
  
  // إذا لم تكن بيانات المستخدم موجودة، يتم توجيهه إلى صفحة تسجيل الدخول
  if (!isAuth) {
    return <Navigate to="/Login" replace />;
  }
  
  // إذا كان مسجلاً، يتم عرض المكون المطلوب
  return children;
};

function App() {
  return (
    <div dir='rtl'>
      <ToastContainer theme='dark' />
      
      <Routes>
        {/* المسارات العامة المتاحة للجميع */}
        <Route path='/' element={<Home />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Signup' element={<Signup />} />

        {/* مسارات لوحة التحكم المحمية بالكامل */}
        <Route path='/Dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
        <Route path='/AddMaterial' element={<ProtectedRoute><AddMaterial /></ProtectedRoute>} /> 
        <Route path='/AddMaterial/:materialName' element={<ProtectedRoute><AddMaterial /></ProtectedRoute>} /> 
        <Route path='/addInventory' element={<ProtectedRoute><AddInventory /></ProtectedRoute>} /> 
        <Route path='/AddProducts' element={<ProtectedRoute><AddProducts /></ProtectedRoute>} /> 
        <Route path='/Book' element={<ProtectedRoute><Book /></ProtectedRoute>} /> 
        <Route path='/AddService' element={<ProtectedRoute><AddService /></ProtectedRoute>} /> 
        <Route path='/AddSupplies' element={<ProtectedRoute><AddSupplies /></ProtectedRoute>} /> 
        <Route path='/AddEquipment' element={<ProtectedRoute><AddEquipment /></ProtectedRoute>} /> 
        <Route path='/AddPatient' element={<ProtectedRoute><AddPatient /></ProtectedRoute>} /> 
        <Route path='/PatientFile/:id' element={<ProtectedRoute><UpdatePatient /></ProtectedRoute>} /> 
        <Route path='/Doctor' element={<ProtectedRoute><Doctor /></ProtectedRoute>} /> 
        
        {/* توجيه أي مسار عشوائي غير موجود */}
        <Route path='*' element={<Navigate to="/Login" replace />} />
      </Routes>
    </div>
  )
}

export default App