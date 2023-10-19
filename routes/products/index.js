import { Router } from "express";
import { getProducts, getSingleProduct, getSearchData, addToCart, getImg, addProductImgs,addProductData } from '../../controllers/product/index.js';




var products = Router();
products.get('/products', getProducts)
products.get('/product/:id', getSingleProduct)
products.get('/search/:searchKey', getSearchData)
products.get('/img/:productId/:imgName', getImg)
products.post('/addToCart', addToCart)
products.post('/addProductImgs', addProductImgs)
products.post('/addProductData', addProductData)


export default products;