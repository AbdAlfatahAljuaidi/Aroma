const mongoose = require("mongoose")


const orderSchema = new mongoose.Schema({
    orderID: {
        type: String
    },

    clientName: {
        type: String
    },

    order: [{
        name: {
            type: String
        },
        price: {
            type: Number
        }



    }],

    employeeName: {
        type: String
    },
    TotalBD: {
        type: Number
    },
    Discount: {
        type: Number
    },
    Total: {
        type: Number
    },
    Type: {
        type: String
    }
}, { timestamps: true })

const order = mongoose.model("Orders", orderSchema)

module.exports = order