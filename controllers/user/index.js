import { Types } from 'mongoose'
import userModel from '../../models/user.js'
import productModel from '../../models/products.js'
import bcrypt from 'bcryptjs'
const userRegister = (req, res) => {
    userModel.findOne({ userName: req.body.userName }, async (err, doc) => {
        if (err) {
            throw err
        }
        if (doc) {
            res.json(
                {
                    msg: 'User Already Exists',
                    actionDone: false
                }
            )
        } else {
            const hashPass = await bcrypt.hash(req.body.password, 10)
            const newUser = new userModel({ userName: req.body.userName, password: hashPass })
            await newUser.save((err, done) => {
                if (err) {
                    throw err
                } else {
                    res.json({
                        ...done,
                        msg: 'successfully registered',
                        actionDone: true,
                    })
                }

            })
        }
    })

}












const userLogin = (req, res) => {
    userModel.findOne({ userName: req.body.userName }, async (err, doc) => {
        if (err) {
            throw err
        }
        if (!doc) {
            res.json(
                {
                    msg: 'User Does Not Exist',
                    actionDone: false
                }
            )
        } else {
            bcrypt.compare(req.body.password, doc.password, (err, result) => {
                if (err) {
                    throw err
                }
                if (result) {
                    req.session.user = doc
                    res.json(
                        {
                            data: {
                                _id: doc._id,
                                userName: doc.userName,
                            },
                            msg: 'Successfully Logged In',
                            actionDone: true,
                        }
                    )
                } else {
                    res.json(
                        {
                            msg: 'Incorrect Password',
                            actionDone: false,
                        }
                    )
                }
            })
        }
    })

};




const getUserCart = async (req, res) => {
    const shipping = 10
    var cartData = {
        productsData: [],
        shipping,
        productsTotalPrice: 0,
        subTotal: 0
    }
    let specifiedUser = await userModel.findOne({ _id: Types.ObjectId(req.body._id) })
    for (let i = 0; i < specifiedUser.cart.length; i++) {
        const singleProduct = await productModel.findOne({ _id: Types.ObjectId(specifiedUser.cart[i].productId) })
        const dataToInsert = {
            _id: specifiedUser.cart[i].productId,
            name: singleProduct.name,
            description: singleProduct.description,
            price: singleProduct.price,
            count: specifiedUser.cart[i].count,
            image: singleProduct.imgs[0]
        }
        cartData.productsData = [...cartData.productsData, dataToInsert]
        cartData.productsTotalPrice += singleProduct.price * specifiedUser.cart[i].count
    }
    cartData.subTotal += cartData.productsTotalPrice + shipping


    const result = ({
        msg: 'The cart has been processed successfully',
        actionDone: true,
        cartData
    })
    res.json(result)

}

const deleteProductFromCart = (req, res) => {
    const user_id = req.body._id
    const productId = req.body.productId

    userModel.updateOne({ _id: Types.ObjectId(user_id) }, { $pull: { cart: { productId } } }).then(
        () => {
            res.json({
                msg: 'The product has been removed from the shopping cart',
                actionDone: true,
            })
        }
    )


}
export { userRegister, userLogin, getUserCart, deleteProductFromCart }