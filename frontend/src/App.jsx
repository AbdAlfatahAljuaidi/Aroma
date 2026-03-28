import React from 'react'
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import Home from './components/Home/Home'
import Signup from './components/Register/Signup'
import Login from './components/Register/Login'
import Dashboard from './components/Dashboard/Dashboard'  

import {ToastContainer} from 'react-toastify'
import AddMaterial from './components/Dashboard/AddMaterial'
import AddInventory from './components/Dashboard/AddInventory'
import AddProducts from './components/Dashboard/AddProducts'
import Invoice from './components/Dashboard/Invoice'
import AI from './components/Dashboard/AI'

function App() {

  return (
  <div dir='rtl'>
     <ToastContainer
      theme='dark'
      />
<Routes>
      <Route path='/' element={<Home />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/Signup' element={<Signup />} />
      <Route path='/Dashboard' element={<Dashboard />} /> 
      <Route path='/AddMaterial' element={<AddMaterial />} /> 
      <Route path='/AddMaterial/:materialName' element={<AddMaterial />} /> 
      <Route path='/addInventory' element={<AddInventory />} /> 
      <Route path='/AddProducts' element={<AddProducts />} /> 
      <Route path='/Invoice/:id' element={<Invoice />} /> 
      <Route path='/AI' element={<AI />} /> 
   
    </Routes>
  
  </div>
    )
}

export default App
