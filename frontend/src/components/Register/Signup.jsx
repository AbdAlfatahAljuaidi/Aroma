import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import{toast} from 'react-toastify'
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const Signup = () => {

  const [employee,setEmpolyee] = useState(false)
  const [formData,setFormData] = useState({
    name:"",
    phoneNumber:"",
    age:0,
    gender:"",
    password:"",
    confirmPassword:"",
  })

  const [employeeData, setEmployeeData] = useState({
    name:"",
    email:"",
    code:0,
    password:"",
    confirmPassword:""
  })

  const navigate = useNavigate()

  const onChange = (e)=> {
setFormData({
  ...formData,
  [e.target.name]:e.target.value
})
  } 

  const addEmployeeData = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value
    })

  }
 
  const  SignupClient = async () => {
    try {
      const {data} = await axios.post(`${apiUrl}/Signup`,{
      formData
      })
      
      if(data.error==false){
        toast.success(data.message)
        navigate("/Login")
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
      
    }
  }


  const registerEmployee = async () => {
    try {
      const {data} = await axios.post(`${apiUrl}/registerEmployee`,{
        employeeData
      })
      if(data.error==false){
        toast.success(data.message)
        navigate("/Login")
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
<h1 className='text-center text-2xl '>تسحيل حساب</h1>


<div className='mt-5 flex justify-center items-center'>
  <button onClick={()=> setEmpolyee(false)} className={`px-5 py-1 rounded-md hover:cursor-pointer hover:scale-105 duration-300 transition-all ${employee? 'border border-amber-800 text-amber-800' : 'bg-amber-800 text-white' } `}> تسجيل مستخدم</button>
  <button onClick={()=>setEmpolyee(true)} className={`px-5 py-1 rounded-md hover:cursor-pointer mr-2 hover:scale-105 duration-300 transition-all ${employee? 'bg-amber-800 text-white' : 'border border-amber-800 text-amber-800' }`}> تسجيل موظف</button>
</div>



{
  employee? (

    <div>
    <input onChange={addEmployeeData} name='name' type="text" placeholder='يرجى ادخال الاسم' className='mt-10 border w-80 h-10 placeholder:px-2 rounded-md ' />
    <input onChange={addEmployeeData} name='email' type="email" placeholder=' يرجى ادخال البريد الالكتروني' className='mt-4 border w-80 h-10 placeholder:px-2 block rounded-md ' />
    
    <input onChange={addEmployeeData} name='code' type="password" placeholder='يرجى ادخال رمز الدخول ' className='mt-4 border w-80 h-10 placeholder:px-2 block rounded-md' />
    <input onChange={addEmployeeData} name='password' type="password" placeholder='يرجى ادخال  كلمة مرور ' className='mt-4 border w-80 h-10 placeholder:px-2 block rounded-md' />
    <input onChange={addEmployeeData} name='confirmPassword' type="password" placeholder='يرجى ادخال  كلمة مرور مرة اخرى' className='mt-4 border w-80 h-10 placeholder:px-2 block rounded-md' />
    
    <button onClick={() => registerEmployee()} className='block mt-8 w-80 bg-amber-800 py-2 text-white rounded-md hover:cursor-pointer hover:scale-105 transition-all duration-300'>نسجيل</button>
   
    </div>


 
  ):(
    <div>
      <input onChange={onChange} name='name' type="text" placeholder='يرجى ادخال الاسم' className='mt-10 border w-80 h-10 placeholder:px-2 rounded-md ' />
    <input onChange={onChange} name='phoneNumber'  type="text" placeholder='يرجى ادخال رقم الموبايل ' className='mt-4 border w-80 h-10 placeholder:px-2 block rounded-md ' />
    <input onChange={onChange} name='age'  type="number" placeholder='يرجى ادخال  العمر ' className='mt-4 border w-80 h-10 placeholder:px-2 block rounded-md ' />
    
    <select onChange={onChange} name='gender'  className='mt-4 border p-2 w-80 rounded-md'>
        <option value="male">ذكر</option>
        <option value="Female">أنثى</option>
    </select>
    
    <input onChange={onChange} name='password'  type="password" placeholder='يرجى ادخال  كلمة مرور ' className='mt-4 border w-80 h-10 placeholder:px-2 block rounded-md ' />
    <input onChange={onChange} name='confirmPassword'  type="password" placeholder='يرجى ادخال  كلمة مرور  مرة اخرى' className='mt-4 border w-80 h-10 placeholder:px-2 block rounded-md ' />
    

   
  
   <button onClick={()=>SignupClient() } className='block mt-8 w-80 bg-amber-800 py-2 text-white rounded-md hover:cursor-pointer hover:scale-105 transition-all duration-300'>نسجيل</button>
    </div>  
  )
}
  <span className='mt-3 block'> هل لديك حساب بالفعل؟ <Link to={'/Login'} className='hover:underline'> تسجيل الدخول</Link> </span>


 </div>
        </div>
    </div>
  )
}

export default Signup