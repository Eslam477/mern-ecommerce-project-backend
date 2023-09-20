import mongoose from "mongoose";

var userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: []
    }
})

const userModel = mongoose.model('Users', userSchema)


export default userModel;