import { Router } from "express";
import { getProducts, getSingleProduct, getSearchData , addToCart } from '../../controllers/product/index.js';
import productModel from '../../models/products.js'
var products = Router();
products.get('/products', getProducts)
products.get('/product/:id', getSingleProduct)
products.get('/search/:searchKey', getSearchData)
products.post('/addToCart', addToCart)

products.get('/addProduct', async (req, res) => {
    var newProduct = new productModel({
        name: 'test' + Math.ceil(Math.random(1, 100) * 100),
        price: 100,
        description: 'Mollit eiusmod irure consectetur cupidatat occaecat voluptate fugiat adipisicing. Nostrud anim magna dolore excepteur aliqua laboris cillum incididunt nulla dolore voluptate voluptate. Mollit commodo adipisicing cillum pariatur mollit irure laborum do proident in. Nostrud elit exercitation mollit tempor proident officia enim mollit ea. Anim ipsum amet magna irure quis irure ipsum amet esse velit deserunt.',
        count: Math.ceil(Math.random(1, 100) * 100)
    })
    var answer = await newProduct.save()
    res.send(answer)
})


export default products;