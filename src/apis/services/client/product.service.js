const httpStatus = require('http-status')

const ApiError = require('../../../utils/api-error')
const { Product } = require('../../models')

/**
 * Create a product
 *@param {string} id
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {

    return Product.create(productBody)
}
const updateProduct = async (id,productBody) => {
    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No Product existed')
    }
    return product.update(productBody)
}
const filterProduct = async (category, brand, priceMin, priceMax,gender,size) => {
    const query = {
        brand: brand || { $regex: "" },
        price: { $gt: priceMin || 0, $lt: priceMax || 9999999999 },
        status: category || { $regex: "" },
        gender: gender || { $regex:""},
        size: size || { $regex:""},
    }
    console.log(query);
    const product = await Product.find(query);
     if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No Product existed')
    }
    return product;
    //agc().then().catch()
}
const searchProduct = async (productName) => {
    const query = {
        productName: productName || { $regex: "" },
    }
    const product = await Product.find(query);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No Product existed')
    }
    return product;
}

module.exports = {
    createProduct,
    updateProduct,
    filterProduct,
    searchProduct
}
