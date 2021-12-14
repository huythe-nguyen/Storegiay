const httpStatus = require('http-status')
const catchAsync = require('../../../utils/catch-async')
const { cartUserService } = require('../../services')
const { Cart } = require('../../models')
const Email = require('../../../utils/email')

const addCart = catchAsync(async (req, res, next) => {
    try {
        const cart = await cartUserService.createCart(req.body)

        const url = `Gio hang cua ban!`;
        await new Email(cart, url).sendCartInfo();  //cart: id, user(id), phone, address, total, displayName, email, products[]

        res.status(httpStatus.CREATED).json({
            success: true,
            cart: cart
        });
    } catch (err) {
        console.log(err);
    }
})

const viewCart = catchAsync(async (req, res) => {
    const userId= req.params.userId
    const cart = await cartUserService.view(userId);
    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'No cart existed'
        });
    }
    res.json({
       carts:cart
    })
})
const viewUpdate = catchAsync(async (req, res) => {
    const id= req.params.id
    const cart = await cartUserService.viewUpdate(id);
    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'No cart existed'
        });
    }
    res.json({
        cart: cart
    })
})
const viewAllCart = catchAsync(async (req, res, next) => {
    try {
        const product = await cartUserService.viewAllCart();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'No cart existed'
            });
        }
        res.json({
            success: true,
            carts: product,
        });
    } catch (err) {
        console.log(err);
    }
})

const updateCart = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const cart = await cartUserService.updateCart(id, req.body)
    res.status(httpStatus.OK).json({
        success: true,
        cart: cart
    });
})

const deleteCart = catchAsync(async (req, res) => {
    const id = req.params.id
    const product = await cartUserService.deleteCart(id)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Cart is delete'
    });
})

module.exports = {
    addCart,
    viewCart,
    viewAllCart,
    updateCart,
    deleteCart,
    viewUpdate
}
