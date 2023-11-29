import { Router } from "express";
import products from "./products/index.js"
import userRouts from './user/index.js'
import admin from './admin/index.js'
var collectionRouts = Router()

collectionRouts.get('/', (req, res) => {
    res.send('server running successfully')
})
collectionRouts.use(products)
collectionRouts.use(userRouts)
collectionRouts.use('/admin',admin)
export default collectionRouts;