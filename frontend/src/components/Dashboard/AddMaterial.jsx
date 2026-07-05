import React, { useEffect, useState } from "react";
import { useNavigate ,useParams} from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const ProductForm = () => {

  const navigate = useNavigate();
  const {materialName} = useParams()

  const isAddPage = !materialName

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    status: "متوفر"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const addMaterial = async () => {
    try {
      console.log("formData",formData);
      
      const {data} = await axios.post(`${apiUrl}/addMaterial`,
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


  useEffect(()=> {

    if(!isAddPage){
    const getMaterial = async () => {
      try {
        const {data} = await axios.get(`${apiUrl}/getMaterial/${materialName}`)
  
        if(data.error==false){
          setFormData(data.material)
          console.log(data.material);
          
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
      }
    }

    getMaterial()
  }

  
  },[materialName])


  const editMaterial = async () => {
    try{
      console.log("data",formData);
      
      const {data} = await axios.put(`${apiUrl}/editMaterial`, 
        formData
      )
      console.log("check");

if (data.error == false){
  toast.success(data.message)
}

    }catch(error){
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
          إدارة المنتج
        </h2>

        <div className="space-y-5">

          {/* الاسم */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              اسم المنتج
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل اسم المنتج"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* السعر */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              السعر
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="أدخل السعر"
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

          {/* الحالة */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              الحالة
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>متوفر</option>
              <option>قرب على الانتهاء</option>
              <option>انتهى</option>
            </select>
          </div>

          {/* الأزرار */}
          <div className="flex gap-4 pt-4">

{isAddPage ? (
   <button
   onClick={addMaterial}
   className="flex-1 bg-primary text-white hover:cursor-pointer py-3 rounded-lg font-semibold hover:opacity-90 transition"
 >
   إضافة المنتج
 </button>

):(

  <button
  onClick={()=> editMaterial()}
  className="flex-1 border hover:cursor-pointer border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
>
  تعديل المنتج
</button>
)

}
         


          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductForm;