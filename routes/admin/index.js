import { Router } from "express";
import { adminGetProductsBySearch, adminGetProductData, adminUpdateProductImgs,adminUpdateProductData } from "../../controllers/admin/products.js";


var admin = Router();

admin.get('/getProductsBySearch/:searchText/:searchBy', adminGetProductsBySearch)
admin.get('/getProductData/:productId', adminGetProductData)
admin.post('/adminUpdateProductImgs', adminUpdateProductImgs)
admin.post('/adminUpdateProductData', adminUpdateProductData)


export default admin;