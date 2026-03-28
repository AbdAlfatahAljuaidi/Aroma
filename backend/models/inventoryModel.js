const mongoose = require("mongoose")


const inventorySchema = new mongoose.Schema({
    name:{
        type:String
    },
    type:{
        type:String
    },
   
    quantity:{
        type:String
    }
},{timestamps:true})

const inventory = mongoose.model("Inventory",inventorySchema )

module.exports = inventory