import React, { useState } from "react";
import axios from 'axios'
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const AddProducts = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    type: "",
    cost: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file)); // 👈 preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.image) {
      alert("Please select an image ❌");
      return;
    }
  
    try {
      setLoading(true);
  
      const data = new FormData();
  
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("type", formData.type);
      data.append("cost", formData.cost);
      data.append("image", formData.image);
  
      const res = await axios.post(
        `${apiUrl}/createProduct`,
        data
      );
  
      console.log(res.data); // 👈 هون البيانات
  
      alert("Product added successfully");
  
      // reset
      setFormData({
        name: "",
        price: "",
        type: "",
        cost: "",
        image: null,
      });
      setPreview(null);
  
    } catch (error) {
      console.error(error);
  
      // 👇 أهم جزء مع axios
      const message =
        error.response?.data?.message || "Error ❌";
  
      alert(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">اضافة منتج</h2>

        {/* Image */}
        <div>
  <label className="block mb-2 font-semibold text-gray-700">
    صورة المنتج
  </label>

  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-gray-50 transition">
    
    <div className="flex flex-col items-center justify-center pt-5 pb-6">
      <svg
        className="w-8 h-8 mb-2 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
      <p className="text-sm text-gray-500">
        اضغط لرفع صورة أو اسحبها هنا
      </p>
    </div>

    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="hidden"
    />
  </label>

  {preview && (
    <img
      src={preview}
      alt="preview"
      className="mt-4 w-full h-48 object-cover rounded-xl shadow"
    />
  )}
</div>

        {/* Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          placeholder="اسم المنتج"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          placeholder="السعر"
        />

        {/* Type */}
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          placeholder="النوع"
        />

        {/* Cost */}
        <input
          type="number"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          placeholder="التكلفة"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          {loading ? "يتم اضافة المنتج..." : "اضافة المنتج"}
        </button>
      </form>
    </div>
  );
};

export default AddProducts;