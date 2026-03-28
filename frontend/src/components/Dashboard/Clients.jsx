import React, { useEffect, useState } from "react";
import { IoPerson } from "react-icons/io5";
import axios from 'axios'
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const Clients = () => {

  const [clients, setClients] = useState([])

  useEffect(() => {
const getClients = async () => {
  const {data} = await axios.get(`${apiUrl}/getClients`)
  if(data.error==false){
    setClients(data.clients)
  }
}
getClients ()
  },[])

  return (
    <div className="bg-gray-50/20 min-h-screen">
      
      {/* Header */}
      <h1 className="px-8 py-6 text-3xl font-bold bg-white shadow-sm">
        الموظفين
      </h1>

      {/* Page Title */}
      <div className="p-8">
        <div className="mb-6">
          <p className="text-2xl font-bold"> الموظفين</p>
          <p className="text-primary text-lg mt-1">
            إدارة  الموظفين
          </p>
        </div>

        {/* Clients Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
{
  clients.map((client,index)=>(
   <div key={index} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">

   {/* Top Section */}
   <div className="flex justify-between items-center mb-4">

     <div className="bg-amber-400/20 rounded-full w-12 h-12 flex justify-center items-center">
       <IoPerson className="text-2xl text-primary" />
     </div>

     <p className="px-3 py-1 bg-amber-400/20 text-primary rounded-full text-sm font-medium">
       {client.points} نقطة
     </p>

   </div>

   {/* Client Info */}
   <p className="font-semibold text-lg">
     {client.name}
   </p>

   <p className="text-gray-500">
   {client.phoneNumber}
   </p>

 </div>

  ))
}
       

        </div>
      </div>
    </div>
  );
};

export default Clients;