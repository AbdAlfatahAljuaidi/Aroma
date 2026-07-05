import React, { useEffect, useState } from "react";
import { useNavigate ,useParams} from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const AddInventory = () => {

const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const addInventory = async () => {
    try {
      console.log("formData",formData);
      
      const {data} = await axios.post(`${apiUrl}/addInventory`,
        formData
      )
      if(data.error==false){
        toast.success(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">

      {/* زر الرجوع */}
      <div
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary cursor-pointer mb-6 font-medium hover:opacity-80"
      >
        <FaArrowRight />
        الرجوع للخلف
      </div>

      <div className="bg-white shadow-md rounded-xl max-w-xl mx-auto p-8">

        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          إدارة المخزون
        </h2>

        <div className="space-y-5">

          {/* الاسم */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              اسم المخزون
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل اسم المخزون"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* السعر */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              النوع
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="أدخل النوع"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* الكمية */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              الكمية
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="أدخل الكمية"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>


          {/* الأزرار */}
          <div className="flex gap-4 pt-4">

   <button
   onClick={addInventory}
   className="flex-1 bg-primary text-white hover:cursor-pointer py-3 rounded-lg font-semibold hover:opacity-90 transition"
 >
   إضافة المخزون
 </button>




         


          </div>

        </div>

      </div>
    </div>
  );
};

export default AddInventory;