const httpStatus = require('http-status')
const catchAsync = require('../../../utils/catch-async')
const { cartService } = require('../../services')
const { Cart } = require('../../models')


const list = catchAsync(async (req, res, next) => {
    const page = req.query.page
    const size = req.query.size
    const List = await cartService.list(page,size)
    res.status(httpStatus.OK).json({
        success: true,
        cart: List
    });
})
const search = catchAsync(async (req, res, next) => {
    const key =req.params.key
    const list = await cartService.search(key)
    res.status(httpStatus.OK).json({
        success: true,
        cart: list
    });
})
const view = catchAsync(async (req, res, next) => {
    const cart = await Cart.findById(req.params.id)

        if(!cart){
            return res.status(500).json({
                success: false,
                message: 'No cart existed'
            });
        }
        res.json({
            success: true,
            cart: cart
        });
})

module.exports = {
    list,
    search,
    view
}
