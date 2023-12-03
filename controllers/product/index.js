import mongoose from "mongoose";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import productModel from "../../models/products.js";
import userModel from "../../models/user.js";
import multer from 'multer'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const addProductImgs = async (req, res) => {

    var imgsNameList = []
    const productId = mongoose.Types.ObjectId();
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const destinationFolder = `./store/cache/${productId}`;

            if (!fs.existsSync(destinationFolder)) {
                fs.mkdirSync(destinationFolder);
            }
            cb(null, destinationFolder);
        },
        filename: function (req, file, cb) {
            const fname = file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname;
            imgsNameList.push(fname)
            cb(null, fname);
        }
    });

    const upload = multer({ storage: storage }).array('file');

    upload(req, res, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error has been detected' });
        } else {
            console.log('New data has been detected in the cache ❗❗❗❗');
            const response = {
                actionDone: true,
                result: {
                    productId,
                    imgsNameList
                },
            }
            res.status(202).json(response)
        }
    });
}


const addProductData = (req, res) => {
    const newProduct = new productModel({
        _id: mongoose.Types.ObjectId(req.body.productId),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        count: req.body.quantity,
        available: req.body.availability,
        imgs: req.body.imgsNameList
    });




    if (newProduct.save()) {
        const cacheFilePath = path.join(
            `./store/cache/${req.body.productId}`
        )

        const savingFilePath = path.join(
            `./store/productsImg/${req.body.productId}`
        )


        if (fs.existsSync(cacheFilePath)) {
            fs.move(cacheFilePath, savingFilePath, (error) => {
                if (error) {
                    console.error('An error occurred while moving the directory:', error);
                    const response = {
                        actionDone: false,
                        msg:`An error occurred while moving the directory: ${error}`,
                    }
                    res.status(500).json(response)
                } else {
                    console.log('Directory moved successfully!');
                    const response = {
                        actionDone: true,
                        msg:'The product has been added successfully',
                    }
                    res.status(201).json(response)
                }
            })
        }

    }
}









var getProducts = async (req, res) => {
    const result = await productModel.find();

    const modifiedResult = result.map((product) => {
        product.imgs = [`collection/img/${product._id}/${product.imgs[0]}`];
        return product;
    });
    res.json(modifiedResult);
};
const getSearchData = async (req, res) => {
    try {
        const { searchKey } = req.params;
        const result = await productModel.find({
            name: { $regex: searchKey, $options: "i" }
        });
        const modifiedResult = result.map((product) => {
            product.imgs = [`collection/img/${product._id}/${product.imgs[0]}`];
            return product;
        });
        res.json(modifiedResult);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while searching data" });
    }
};
const getSingleProduct = async (req, res) => {
    var result = await productModel.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
    });
    let imgUrls = [];
    const productId = result._id;
    const productImgs = result.imgs;
    for (let i = 0; i < productImgs.length; i++) {
        const imageUrl = `collection/img/${productId}/${productImgs[i]}`;
        imgUrls.push(imageUrl);
    }

    result.imgs = imgUrls;
    res.json(result);
};

const addToCart = async (req, res) => {
    var result = await userModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.body.userId) },
        {
            $addToSet: {
                cart: {
                    productId: req.body.productId,
                    count: req.body.productCount || "1",
                },
            },
        }
    );
    if (result) {
        const resData = {
            msg: "Product added to cart",
            actionDone: true,
            ...result,
        };
        res.json(resData);
    } else {
        const resData = {
            msg: "Product not added to cart",
            actionDone: false,
        };
        res.json(resData);
    }
};

const getImg = async (req, res) => {

    const { productId } = req.params;
    const { imgName } = req.params;
    const imageFolder = path.join(
        __dirname + `/../../store/productsImg/${productId}/${imgName}`
    );
    if (fs.existsSync(imageFolder)) {
        res.sendFile(imageFolder);
    } else {
        res.status(404).send("Image not found");
    }
};

export {
    addProductImgs,
    addProductData,
    getProducts,
    getSingleProduct,
    getSearchData,
    addToCart,
    getImg,
};
