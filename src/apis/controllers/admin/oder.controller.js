const httpStatus = require('http-status')
const catchAsync = require('../../../utils/catch-async')
const { oderService } = require('../../services')
const { Cart } = require('../../models')


const add = catchAsync(async (req, res, next) => {
    const oders = await oderService.create(req.body)
    res.status(httpStatus.CREATED).json({
        success: true,
        oder: oders
    });
})
const list = catchAsync(async (req, res, next) => {
    const page = req.query.page
    const size = req.query.size
    const key = req.params.status
    const oderList = await oderService.list(page,size,key)
    res.status(httpStatus.OK).json({
        success: true,
        oder: oderList
    });
})
const search = catchAsync(async (req, res, next) => {
    const state = req.query.state
    const phone = req.query.phone
    const list = await oderService.search(state,phone)
    res.status(httpStatus.OK).json({
        success: true,
        oder: list
    });
})
const view = catchAsync(async (req, res, next) => {
    const oder = await Cart.findById(req.params.id)
        if(!oder){
            return res.status(500).json({
                success: false,
                message: 'No product existed'
            });
        }
        res.json({
            success: true,
            oder: oder
        });
})
const exit = catchAsync(async (req, res) => {
    const id = req.params.id
    const oder = await  oderService.update(id,req.body)
    res.status(httpStatus.OK).json({
        success: true,
        oder: oder
    });
})
const count = catchAsync(async (req, res) => {
    const key = req.params.state
    const list = await Cart.find({state: key}).count()
    res.status(httpStatus.OK).json({
        count: list
    });
})
const total = catchAsync(async (req, res) => {
    const key = req.params.state
    const list = await Cart.find({state: key})
    res.status(httpStatus.OK).json({
        count: list
    });
})
module.exports = {
    add,
    list,
    search,
    view,
    exit,
    count,
    total
}
