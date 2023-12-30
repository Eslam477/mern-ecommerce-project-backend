import { Schema, model } from "mongoose";

var ordersSchema = new Schema({
    client: {
        type: String,
        required: true,
    },
    
})

const ordersModel = model('products', ordersSchema)


export default ordersModel;