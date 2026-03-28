
const Client = require("../models/clientModel")
const Employee = require("../models/employeeModel")



exports.Signup = async (req, res) => {
    try {

        const { name, phoneNumber, age, gender, password, confirmPassword } = req.body.formData
        console.log(req.body);

        if (!name || !phoneNumber || !gender || !age || !password || !confirmPassword) {
            return res.status(400).json({ error: true, message: "كل الحقول مطلوبة" })
        }

        const existingPhoneNumber = await Client.findOne({ phoneNumber })
        if (existingPhoneNumber) {
            return res.status(400).json({ error: true, message: "رقم الهاتف موجود مسبقا" })
        }

        if (password != confirmPassword) {
            return res.status(400).json({ error: true, message: "كلمة السر غير متوافقة " })
        }

        const client = await Client.create(req.body.formData)

        return res.status(200).json({ error: false, message: "تم انشاء عميل جديد بنجاح" })




    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "internal server error" })

    }
}


exports.Login = async (req, res) => {
    try {
    
        const { name, password } = req.body.formData
        if (!name || !password) {
            return res.status(400).json({ error: true, message: "كل الحقول مطلوبة" })
        }

        const checkClient = await Client.findOne({name})
        const checkEmployee = await Employee.findOne({name})
        console.log("he21212lo");
        if(!checkClient && !checkEmployee){
         return res.status(404).json({error:true, message:"المستخدم غير موجود"})
        }
        console.log("helo");
        if(!checkClient){
            if(password != checkEmployee.password){
                return res.status(404).json({error:true, message:"كلمة السر غير صحيحة"})
            }
        }else {
            if(password != checkClient.password){
                return res.status(404).json({error:true, message:"كلمة السر غير صحيحة"})
            }
        }
console.log("done");

if(checkEmployee){
    return res.status(200).json({error:false,message:"اهلا و سهلا" , client:"false" })

}else{
    return res.status(200).json({error:false,message:"اهلا و سهلا بك", client:"true"})
}



    } catch (error) {
        console.log(error);
return res.status(500).json({error:true,message:"internal server error"})
    }
}


exports.getClients = async (req,res) => {
try {
    const clients = await Client.find()
    return res.status(200).json({error:false,clients})
} catch (error) {
    console.log(error);
    return res.status(500).json({error:true,message:"internal server error"})
    
}
}