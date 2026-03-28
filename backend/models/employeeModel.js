const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    code:{
        type:Number
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})


const employee = mongoose.model("Employee",employeeSchema )

module.exports = employee