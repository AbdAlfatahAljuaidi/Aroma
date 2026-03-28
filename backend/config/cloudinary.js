const cloudinary = require("cloudinary").v2;
require("dotenv").config()

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,  // اسم السحابة الخاصة بك
  api_key:  process.env.APIKEY,  // مفتاح API
  api_secret:  process.env.APISECRET,
});

module.exports = cloudinary;