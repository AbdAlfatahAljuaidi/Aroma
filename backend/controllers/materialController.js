const material = require('../models/materialModel')
const Material = require('../models/materialModel')

exports.addMaterial = async (req,res) => {
    try {
        console.log("req.body.formDatar",req.body);
        
        const {name , price , quantity , status} = req.body

        if(!name || !price || !quantity || !status){
            return res.status(400).json({error:true,message:"كل الحقول المطلوبة"})
        }

        const existingName = await Material.findOne({name})

        if(existingName){
            return res.status(400).json({error:true,message:"الاسم موجود بالفعل"})
        }

        const newMaterial = await Material.create(
            req.body
        ) 

        return res.status(200).json({error:false , message:"تم الاضافة بنجاح",newMaterial})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:true,message:"internal server error"})
    }
}

exports.getMaterials = async (req,res) => {
    try {
        const Materials = await Material.find()
        return res.status(200).json({error:false,Materials})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:true,message:"internal server error"})
    }
}

exports.getMaterial = async (req,res) => {
    try {

        const {materialName} = req.params
        console.log("name",materialName);
        
        const material = await Material.findOne({name:materialName})
        if(!material){
            return res.status(404).json({error:true,message:"الاسم غير صحيح"})
        }

    return res.status(200).json({error:false,message:"asd",material})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:true,message:"internal server error"})
    }
}

exports.editMaterial = async (req,res) => {
    try {
        console.log("material",req.body);
        const {name , price , quantity , status} = req.body
        console.log("name", name);
        

        if(!name || !price || !quantity || !status){
            return res.status(400).json({error:true,message:"كل الحقول المطلوبة"})
        }

        const material = await Material.findOne({name})

        if(!material){
            return res.status(404).json({error:true, message:"الاسم غير صحيح"})
        }

await Material.findByIdAndUpdate(
    material._id,

    req.body,
    {new:true}
)

return res.status(200).json({error:false,message:"تم التعديل بنجاح"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:true,message:"internal server error"})
    }
}


exports.deleteMaterial = async (req,res) => {
    try {
        const {materialName} = req.params
        console.log("materialName",materialName);
        
        const material = await Material.findOne({name:materialName})
        console.log("material",material);
        
        const deleteMaterial = await Material.findByIdAndDelete(material._id) 
        return res.status(200).json({error:false , message:"تم الحذف بنجاح"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:true,message:"internal server error"})
    }
}