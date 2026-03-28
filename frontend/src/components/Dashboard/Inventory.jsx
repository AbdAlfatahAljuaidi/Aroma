import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const Inventory = () => {

  const [inventories, setInventories] = useState([])

  useEffect(() => {
    const getInventories = async () => {
      try {
        const {data} = await axios.get(`${apiUrl}/getInventory`)
        
  
        if(data.error==false){
          console.log(data.inventory);
          
          setInventories(data.inventory)
          
          
        }
      } catch (error) {
        console.log(error);
        
      }
    }
    getInventories()
  },[])


  const deleteInventory = async  (id) => {
    try {
      const {data} = await axios.delete(`${apiUrl}/deleteInventory/${id}`)

      if(data.error==false){
        toast.success(data.message)
        setInventories(inventories.filter((item) => item._id != id))
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
      
    }
  }
  return (
<div className="bg-gray-50/20 min-h-screen">
  <h1 className="px-8 py-6 text-3xl font-bold bg-white shadow-sm">
    ادارة المخزون
  </h1>

  <div className="p-8">
    <div className='flex justify-between items-center'>
    <div className="mb-6">
      <p className="text-2xl font-bold">تاريخ المخزون</p>
      <p className="text-primary text-lg mt-1">
      تتبع تعديلات المخزون اليدوية وعمليات التسليم.
      </p>
    </div>
    <Link to={"/addInventory"}>
    <button  className='bg-primary text-white px-6 py-1 rounded-md hover:cursor-pointer hover:scale-105 transition-all duration-300' >اضافة  مخزون</button></Link>
    </div>

    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-600">
              <th className="p-4 font-semibold">الاسم </th>
              <th className="p-4 font-semibold">النوع</th>
              <th className="p-4 font-semibold">الكمية</th>
              <th className="p-4 font-semibold"> تاريخ المستلزم</th>
              <th className="p-4 font-semibold"> عمليات</th>
            </tr>
          </thead>

          <tbody>
            {inventories.map((inventory,index)=>(
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition duration-300"
              >
                <td className="p-4 font-medium">{inventory.name}</td>
                <td className="p-4">{inventory.type}</td>
                <td className="p-4">{inventory.quantity}</td>
                <td className="p-4">
  {new Date(inventory.updatedAt).toLocaleString()}
</td>
                <td className="p-4">
                <button onClick={() => deleteInventory(inventory._id)} className='bg-red-500 text-white px-6 py-1 rounded-md mr-2 hover:cursor-pointer hover:scale-105 transition-all duration-300'>حذف</button>

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

export default Inventory