const mongoose = require("mongoose")

const clientSchema = new mongoose.Schema({
name:{
    type:String,
    required:true
},
phoneNumber:{
    type:String,
    required:true
},
age:{
    type:Number,
    required:true
},
gender:{
    type:String,
    required:true,
},
password:{
    type:String,
    required:true
},
points:{
    type:Number,
    default:0
},
visits:{
    type:Number,
    default:0
}
},{timestamps:true})


const Client = mongoose.model("Client",clientSchema)
module.exports = Client