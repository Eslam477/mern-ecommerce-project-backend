import { Schema, model } from "mongoose";

var productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    imgs: {
        type: [String],
    },
    available:{
        type:Boolean,
        required: true
    }
})

const productModel = model('products', productSchema)


export default productModel;