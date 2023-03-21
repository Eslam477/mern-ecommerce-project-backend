import { Router } from "express";
import { getUserCart, deleteProductFromCart } from '../../controllers/user/index.js';
var userCart = Router();
userCart.post('/getUserCart', getUserCart)
userCart.post('/deleteProductFromCart', deleteProductFromCart)


export default userCart;