import express from "express";
import auth from "./auth.js";
import cart from "./cart.js";

var userRouts = express.Router()

userRouts.use('/user', auth)
userRouts.use('/cart', cart)


export default userRouts;