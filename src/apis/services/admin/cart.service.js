const httpStatus = require('http-status')

const ApiError = require('../../../utils/api-error')
const { Cart } = require('../../models')

const { User } = require('../../models')

/**
 * Create a cart
 * *@param {string} id
 * @param {Object} cartBody
 * @returns {Promise<Brand>}
 */
const list = async (page,size) => {

    if(page){
        pages = parseInt(page);
        if(pages<1)
            pages = 1;

        sizes = parseInt(size);
        if(sizes<5)
            sizes = 5;
        var skips = (pages-1)*sizes;
        const list = await Cart.find().skip(skips).limit(sizes)
        return list
    }else{
        sizes = parseInt(size);
        if(sizes<5)
            sizes = 5;
        const list = await Cart.find().limit(sizes)
        return list
    }


}
const search = async (key) => {
    const list = await Cart.find({$text: {$search: key}});
    return list
}


module.exports = {
    list,
    search
}
