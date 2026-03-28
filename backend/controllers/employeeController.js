const Employee = require('../models/employeeModel')
require('dotenv').config()

exports.Signup = async (req, res) => {
    try {
        console.log(req.body.employeeData);
        const { name, email, code, password, confirmPassword } = req.body.employeeData
        if (!name || !email || !code || !password || !confirmPassword) {
            return res.status(400).json({ error: true, message: "يرجى ادخال جميع الحقول" })
        }
        const existingEmployee = await Employee.findOne({ name })
        if (existingEmployee) {
            return res.status({ error: true, message: "الموظف موجود بالفعل" })
        }
console.log( process.env.CODE);

        if (code != process.env.CODE) {
            return res.status(400).json({ error: true, message: "الرمز غير صحيح" })
        }

        const employee = await Employee.create(
            req.body.employeeData
        )
console.log("done");

        return res.status(200).json({
            error: false,
            message: "تم تسجيل الموظف بنجاح"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "true", message: "internal server error" })

    }
}