const httpStatus = require('http-status')

const ApiError = require('../../../utils/api-error')
const { Oder } = require('../../models')

/**
 * Create a product
 *@param {string} id
 * @param {Object} oderBody
 * @returns {Promise<Oder>}
 *
 */

const create = async (oderBody) => {
    return Oder.create(oderBody)
}
const list = async (page,size,key) => {

    if(page){
        pages = parseInt(page);
        if(pages<1)
            pages = 1;

        sizes = parseInt(size);
        if(sizes<5)
            sizes = 5;
        var skips = (pages-1)*sizes;
        const list = await Oder.find({status: key}).skip(skips).limit(sizes)
        return list
    }else{
        sizes = parseInt(size);
        if(sizes<5)
            sizes = 5;
        const list = await Oder.find({status: key}).limit(sizes)
        return list
    }


}
const search = async (key,statuss) => {
    const query = {
        status: statuss,
        idCard: key
    }
    const list = await Oder.find(query);
    return list
}
const update = async (id,oderBody) => {
    const oders = await Oder.findById(id);
    return oders.update(oderBody)
}

const countPrice = async (key) => {
    count = 0;
    const oders = await Oder.find({status: key});
    if(oders){
        count += oders.price
        return count
    }
    return count
}
module.exports = {
    create,
    list,
    search,
    update,
    countPrice
}
