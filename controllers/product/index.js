import mongoose from 'mongoose';
import productModel from '../../models/products.js'
import userModel from '../../models/user.js';
var getProducts = async (req, res) => {
    const result = await productModel.find()
    res.json(result)
}
var getSingleProduct = async (req, res) => {
    var result = await productModel.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })
    res.json(result)
}

var addToCart = async (req, res) => {
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




// var removeFromCart = async (req, res) => {
//     var result = await productModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, { $pull: { cart: req.body } }, { new: true })
//     res.json(result)
// }

export { getProducts, getSingleProduct, addToCart };