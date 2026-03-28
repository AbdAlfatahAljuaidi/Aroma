import React, { useState } from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const Login = () => {

  const [formData, setFormData] = useState({
    name:"",
    password:"",
  })

  const navigate = useNavigate()

const onchange = (e) => {
  setFormData({
  ...formData,
  [e.target.name]: e.target.value
})
}


const Login = async () => {
  try {
    const {data} = await axios.post(`${apiUrl}/Login`,{
      formData
    })

   if(data.client == "false"){
    navigate("/Dashboard")
    toast.success(data.message)
   }else {
    toast.success(data.message)
   }
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message)
  }
}


  return (
    <div className='bg-amber-800 h-screen '>
    <div className='flex justify-center items-center h-screen'>
        <div className='bg-white p-10 mx-10'>
<h1 className='text-center text-2xl '>تسجيل دخول</h1>




<input onChange={onchange} name="name" type="text" placeholder='يرجى ادخال الاسم ' className='mt-10 border w-80 h-10 placeholder:px-2 rounded-md ' />
<input onChange={onchange} name="password" type="password" placeholder='يرجى ادخال كلمة المرور ' className='mt-4 border w-80 h-10 placeholder:px-2 block rounded-md ' />
<button onClick={()=> Login()} className='block mt-8 w-80 bg-amber-800 py-2 text-white rounded-md hover:cursor-pointer hover:scale-105 transition-all duration-300'>تسجيل الدخول</button>
<span className='mt-3 block'> ليس لديك حساب؟ <Link to={'/Signup'} className='hover:underline'> تسجيل حساب جديد</Link> </span>
   



</div>
    </div>
</div>
  )
}

export default Login