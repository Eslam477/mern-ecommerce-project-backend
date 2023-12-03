import { Router } from "express";
import { adminGetProductsBySearch, adminGetProductData } from "../../controllers/admin/products.js";


var admin = Router();

admin.get('/getProductsBySearch/:searchText/:searchBy',adminGetProductsBySearch)
admin.get('/getProductData/:productId',adminGetProductData)


export default admin;