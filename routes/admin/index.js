import { Router } from "express";
import { adminGetProductsBySearch } from "../../controllers/admin/products.js";


var admin = Router();

admin.get('/getProductsBySearch/:searchText/:searchBy',adminGetProductsBySearch)


export default admin;