const Inventory = require("../models/inventoryModel")

exports.addInventory= async (req,res) => {
    try {
        const { type , name , quantity} = req.body
        if ( !type || !name || !quantity ){
            return res.status(400).json({error:true, message:"جميع البيانات مطلوبة"})
        }

    const newInventory =  await Inventory.create(
            req.body 
        )

        return res.status(200).json({error:false, message:"تم الاضافة بنجاح", newInventory })


    } catch (error) {
        console.log(error);
        return res.status(500).json({error:true, message:"internal server error"})
    }
}

exports.getInventory = async (req,res) => {
    try {
        const inventory = await Inventory.find()
        return res.status(200).json({error:false,inventory})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:true, message:"internal server error"})
    }
}


exports.deleteInventory = async (req,res) => {
    try {
    
        
        const {id} = req.params
        const del = await Inventory.findByIdAndDelete(id)
        return res.status(200).json({error:false , message:"تم الحذف بنجاح"})


    } catch (error) {
        console.log(error);s
        return res.status(500).json({error:true, message:"internal server error"})
        
    }
}