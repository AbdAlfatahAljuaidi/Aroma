import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {toast} from 'react-toastify'
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Materials = () => {

  const [materials , setMaterials] = useState([])

  useEffect(() => {
    const getMaterials = async () => {

      try{
        const {data} = await axios.get(`${apiUrl}/getMaterials`)
        if(data.error== false){
          setMaterials(data.Materials)
        }
      }
  

      catch(error)
      {
        console.log(error)
        toast.error(error.response.data.error)
        
      }

    }

    getMaterials()

  },[])

  const deleteMaterial = async (materialName) => {
    try {
      const {data} = await axios.delete(`${apiUrl}/deleteMaterial/${materialName}`
        
      )

      if(data.error == false){
        toast.success(data.message)
        setMaterials(materials.filter((item) => item.name !== materialName)  )
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
  }


  return (
    <div className="bg-gray-50/20 min-h-screen">
      <h1 className="px-8 py-6 text-3xl font-bold bg-white shadow-sm">
        المستلزمات
      </h1>

      <div className="p-8">
       
      <div className='flex justify-between items-center'>
      <div className="mb-6">
          <p className="text-2xl font-bold">المستلزمات المطلوبة</p>
          <p className="text-primary text-lg mt-1">
            ادارة و عرض جميع المستلزمات
          </p>
        </div>
        <Link to={"/addMaterial"}>
        <button  className='bg-primary text-white px-6 py-1 rounded-md hover:cursor-pointer hover:scale-105 transition-all duration-300' >اضافة مواد خام</button></Link>
</div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">

              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-600">
                  <th className="p-4 font-semibold">اسم المستلزم</th>
                  <th className="p-4 font-semibold">السعر/وحدة</th>
                  <th className="p-4 font-semibold">المخزون حاليا</th>
                  <th className="p-4 font-semibold">الحالة</th>
                  <th className="p-4 font-semibold">العمليات</th>
                </tr>
              </thead>

              <tbody>
                {materials.map((material,index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition duration-300"
                  >
                    <td className="p-4 font-medium">{material.name}</td>
                    <td className="p-4">{material.price}</td>
                    <td className="p-4">{material.quantity}</td>
                    <td className="p-4">{material.status}</td>
                    <td className='flex items-center p-4'>
                      <Link to={`/addMaterial/${material.name}`}>
                      <button className='bg-green-500 text-white px-6 py-1 rounded-md hover:cursor-pointer hover:scale-105 transition-all duration-300'>تعديل</button>
                      </Link>
                      <button onClick={() => deleteMaterial(material.name)} className='bg-red-500 text-white px-6 py-1 rounded-md mr-2 hover:cursor-pointer hover:scale-105 transition-all duration-300'>حذف</button>

                    </td>



                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Materials