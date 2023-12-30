import { Router } from "express";
import { adminGetProductsBySearch, adminGetProductData, adminUpdateProductImgs,adminUpdateProductData,adminRemoveCashAfterUpdate,adminDashpordData } from "../../controllers/admin/products.js";


var admin = Router();

admin.get('/adminDashpordData', adminDashpordData)
admin.get('/getProductsBySearch/:searchText/:searchBy', adminGetProductsBySearch)
admin.get('/getProductData/:productId', adminGetProductData)
admin.post('/adminUpdateProductImgs', adminUpdateProductImgs)
admin.post('/adminUpdateProductData', adminUpdateProductData)
admin.post('/adminRemoveCashAfterUpdate', adminRemoveCashAfterUpdate)


export default admin;