const express = require ('express')
const cors = require ('cors')
const mongoose = require ('mongoose')
const app = express()
const clientRouter = require("./routes/clientRoute")
const employeeRoute = require("./routes/employeeRoute")
const materialRoute = require("./routes/materialRoute")
const inventoryRoute = require("./routes/inventoryRoute")
const productRoute = require("./routes//productRoute")
const orderRoute = require("./routes//orderRoute")
const aiRoute = require("./routes//aiRoute")
const statisticsRoutes = require("./routes/statisticsRoutes")

require('dotenv').config()


app.use(express.json())

app.use(cors({
    origin:process.env.ORIGIN,
}))

app.use("/",clientRouter)
app.use("/",employeeRoute)
app.use("/",materialRoute)
app.use("/",inventoryRoute)
app.use("/",productRoute)
app.use("/",orderRoute)
app.use("/",aiRoute)
app.use("/api", statisticsRoutes);

const DbConnect = () => {


    try{
        mongoose.connect(process.env.DATABASE_URL)
        app.listen(process.env.PORT,() => {
            console.log("Server ready to take off")
        })

    }catch(error){
        console.log("error",error)
    }

 

}

DbConnect()

