import { Router } from "express";
import { adminGetProductsBySearch, adminGetProductData, adminUpdateProduct } from "../../controllers/admin/products.js";


var admin = Router();

admin.get('/getProductsBySearch/:searchText/:searchBy', adminGetProductsBySearch)
admin.get('/getProductData/:productId', adminGetProductData)
admin.post('/adminUpdateProduct', adminUpdateProduct)


export default admin;