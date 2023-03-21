import { Router } from "express";
import products from "./products/index.js"
import userRouts from './user/index.js'
var collectionRouts = Router()
collectionRouts.use(products)
collectionRouts.use(userRouts)
export default collectionRouts;