const httpStatus = require('http-status')

const ApiError = require('../../../utils/api-error')
const { Cart } = require('../../models')
const { User,Product } = require('../../models')

/**
 * Create a cart
 * *@param {string} id
 * @param {Object} cartBody
 * @returns {Promise<Brand>}
 */
const createCart = async (cartBody) => {
    const user = await User.findById(cartBody.user);
    if (user) {
        if (!user.address) {
            user.address = cartBody.address;
        }
        if (!user.phone) {
            user.phone = cartBody.phone;
        }
        await user.save();
    }
    for (let index = 0; index < cartBody.products.length; index++) {
        const element = cartBody.products[index];
        const product = await Product.findById(element.product)
        if(product){
            product.amount = product.amount - element.quantity
            await product.save();
        }
    }
    return await Cart.create(cartBody)
}

const view = async (idUser) => {
    const cart = await Cart.find({userId: idUser});
    return cart
}
const viewUpdate = async (id) => {
    const cart = await Cart.findById(id);
    return cart
}
const viewAllCart = async () => {
    const carts = await Cart.find({});
    return carts
}

const updateCart = async (id, cartBody) => {
    const cart = await Cart.findById(id);
    return cart.update(cartBody)
}

const deleteCart = async (id, cartBody) => {
    const cart = await Cart.findById(id);
    if (!cart) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No cart deleted')
    }
    return cart.remove(cartBody)
}



// const search = async (key) => {
//     const list = await Brand.find({$text: {$search: key}});
//     if (list==0) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'No Brand')
//     }
//     return list
// }

module.exports = {
    createCart,
    view,
    viewAllCart,
    deleteCart,
    updateCart,
    viewUpdate
}
