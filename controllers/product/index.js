import mongoose from 'mongoose';
import fs from 'fs'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import productModel from '../../models/products.js'
import userModel from '../../models/user.js';
var getProducts = async (req, res) => {
    const result = await productModel.find()

    const modifiedResult = result.map((product) => {
        product.imgs = [`collection/img/${product._id}/${product.imgs[0]}`]
        return product;
    });
    res.json(modifiedResult)
}
const getSearchData = async (req, res) => {
    try {
        const { searchKey } = req.params;
        const result = await productModel.find({ name: { $regex: searchKey, $options: 'i' } });
        const modifiedResult = result.map((product) => {
            product.imgs = [`collection/img/${product._id}/${product.imgs[0]}`]
            return product;
        });
        res.json(modifiedResult);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching data' });
    }
};
const getSingleProduct = async (req, res) => {
    var result = await productModel.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })
    let imgUrls = []
    const productId = result._id
    const productImgs = result.imgs
    for (let i = 0; i < productImgs.length; i++) {
        const imageUrl = `collection/img/${productId}/${productImgs[i]}`
        imgUrls.push(imageUrl);
    }

    result.imgs = imgUrls
    res.json(result)
}

const addToCart = async (req, res) => {
    var result = await userModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.userId) }, { $addToSet: { cart: { productId: req.body.productId, count: req.body.productCount || "1" } } })
    if (result) {
        const resData = {
            msg: 'Product added to cart',
            actionDone: true,
            ...result
        }
        res.json(resData)
    } else {
        const resData = {
            msg: 'Product not added to cart',
            actionDone: false
        }
        res.json(resData)
    }

}


const getImg = async (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const { productId } = req.params
    const { imgName } = req.params
    const imageFolder = path.join(__dirname + `/../../store/productsImg/${productId}/${imgName}`);
    if (fs.existsSync(imageFolder)) {
        res.sendFile(imageFolder);
    } else {
        res.status(404).send('Image not found');
    }
}








export { getProducts, getSingleProduct, getSearchData, addToCart, getImg };