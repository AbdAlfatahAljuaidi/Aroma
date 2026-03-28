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
  
      alert("Product added successfully 🔥");
  
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
        <h2 className="text-2xl font-bold text-center">Add Product</h2>

        {/* Image */}
        <div>
          <label className="block mb-1 font-medium">Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-3 w-full h-40 object-cover rounded-lg"
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
          placeholder="Product Name"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          placeholder="Price"
        />

        {/* Type */}
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          placeholder="Type"
        />

        {/* Cost */}
        <input
          type="number"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          placeholder="Cost"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProducts;