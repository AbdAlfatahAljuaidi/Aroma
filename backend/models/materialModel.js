const mongoose = require("mongoose")


const materialSchema = new mongoose.Schema({
    name:{
        type:String
    },
    price:{
        type:Number
    },
    quantity:{
        type:Number
    },
    status:{
        type:String
    }
},{timestamps:true})

const material = mongoose.model("Materials",materialSchema )

module.exports = material