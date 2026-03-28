import React, { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const AI = () => {
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState("");

  const handleFetchAI = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/ai`); // الرابط للـ backend
      setAiData(res.data.text);
    } catch (error) {
      console.error(error);
      setAiData("حدث خطأ أثناء جلب البيانات");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">بيانات المحل بواسطة الذكاء الاصطناعي</h1>

      <button
        onClick={handleFetchAI}
        disabled={loading}
        className="mb-6 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition"
      >
        {loading ? "جاري التحميل..." : "احصل على بيانات المحل"}
      </button>

      {aiData && (
        <div className="max-w-3xl bg-white p-6 rounded-xl shadow-lg text-gray-700 space-y-4">
          {aiData.split(". ").map((sentence, index) => (
            <p key={index} className="text-justify">
              {sentence}.
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default AI;