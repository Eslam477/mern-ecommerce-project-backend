import productModel from '../../models/products.js'
import multer from 'multer'
import fs from "fs-extra";
import { v4 } from 'uuid'
import path from "path";
import { cacheDirHandler } from '../handlers.js'
import { Types } from 'mongoose'

const adminGetProductsBySearch = async (req, res) => {
    const { searchText, searchBy } = req.params
    let result = null

    try {
        switch (searchBy) {
            case 'id':
                result = { actionDone: true, data: [await productModel.findById(Types.ObjectId(searchText)).lean()] }
                break;
            case 'name':
                result = {
                    actionDone: true, data: await productModel.find({
                        name: { $regex: searchText, $options: "i" }
                    }).lean()
                }
                break;
            default:
                result = { actionDone: false, data: null, msg: 'Data cannot be extracted as the request is optimized and is unpredictable' }
                break;
        }

    } catch (error) {
        const expictedError = searchBy == 'id' && searchText.length < 12 ? 'Invalid id' : null
        result = { actionDone: false, data: null, msg: expictedError }
    }
    res.json(result)

}


const adminGetProductData = async (req, res) => {
    const { productId } = req.params
    const productData = await productModel.findById(Types.ObjectId(productId)).lean()

    res.json({
        actionDone: true,
        data: productData
    })
}

const adminUpdateProductImgs = (req, res) => {

    var imgsNameList = []
    const cacheDirPath = cacheDirHandler()
    const folderInCacheName = v4()

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const destinationFolder = `${cacheDirPath}/${folderInCacheName}`;

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
    }
    )
    const upload = multer({ storage }).array('file');

    upload(req, res, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error has been detected' });
        } else {
            console.log('New data has been detected in the cache ❗❗❗❗');
            const response = {
                actionDone: true,
                result: {
                    imgsNameList,
                    folderInCacheName
                },
            }
            res.status(202).json(response)
        }
    });
}



const adminUpdateProductData = async (req, res) => {
    const data = req.body
    const resultFromupdate = await productModel.findByIdAndUpdate({ _id: Types.ObjectId(data.productId) }, {
        $set: {
            name: data.name,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            available: data.availability,
            imgs: data.imgsUrlList
        }
    })

    const cacheDirPath = cacheDirHandler()
    const cacheFilePath = path.join(
        `${cacheDirPath}/${req.body.folderInCacheName}`
    )
    const savingFilePath = path.join(
        `./store/productsImg/${req.body.productId}`
    )
    if (resultFromupdate) {
        if (fs.existsSync(cacheFilePath)) {
            fs.copy(cacheFilePath, savingFilePath, (error) => {
                if (error) {
                    console.error('An error occurred while moving the directory:', error);
                    const response = {
                        actionDone: false,
                        msg: `An error occurred while moving the directory: ${error}`,
                    }
                    res.status(500).json(response)
                } else {

                    console.log('Directory moved successfully!');

                    const response = {
                        actionDone: true,
                        msg: 'Product details have been updated',
                        cacheFilePath
                    }
                    res.status(201).json(response)
                }
            })


        } else {
            const response = {
                actionDone: true,
                msg: 'Product details have been updated',
            }
            res.status(201).json(response)
        }

    } else {
        const response = {
            actionDone: false,
            msg: `An error was detected while saving text data`,
        }
        res.status(500).json(response)
    }




}


const adminRemoveCashAfterUpdate = (req, res) => {
    const cacheFilePath = req.body.cacheFilePath
    console.log(req.body);



    if (fs.existsSync(cacheFilePath)) {
        fs.removeSync(cacheFilePath)

        res.json(
            {
                actionDone: true
            }
        )
    } else {
        res.json(
            {
                actionDone: false
            }
        )
    }



}









const adminDashpordData = async (req, res) => {


        const productsCount = await productModel.countDocuments({});
        console.log(productsCount);
        res.json({
            productsCount
        });

};


export { adminGetProductsBySearch, adminGetProductData, adminUpdateProductImgs, adminUpdateProductData, adminRemoveCashAfterUpdate, adminDashpordData };