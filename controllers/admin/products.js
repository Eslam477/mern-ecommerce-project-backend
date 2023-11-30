import productModel from '../../models/products.js'
import { Types } from 'mongoose'

const adminGetProductsBySearch = async (req, res) => {
    const { searchText, searchBy } = req.params
    let result = null

    try {
        switch (searchBy) {
            case 'id':
                result = {actionDone: true , data:[await productModel.findById(Types.ObjectId(searchText)).lean()]}
                break;
            case 'name':
                result = { actionDone:true, data:await productModel.find({
                    name: { $regex: searchText, $options: "i" }
                }).lean() }
                break;
            default:
                result = { actionDone: false, data: null, msg: 'Data cannot be extracted as the request is optimized and is unpredictable' }
                break;
        }

    } catch (error) {
        const expictedError = searchBy == 'id' && searchText.length < 12 ? 'Invalid id': null
        result = { actionDone: false, data: null, msg: expictedError }
    }
    res.json(result)

}

export { adminGetProductsBySearch };