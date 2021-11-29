const httpStatus = require('http-status')
const catchAsync = require('../../../utils/catch-async')
const { userService } = require('../../services')
const { User } = require('../../models')

const listUser = catchAsync(async (req, res, next) => {
    const page = req.query.page
    const size = req.query.size
    const listUser = await userService.listuser(page,size)
    res.status(httpStatus.OK).json({
        success: true,
        employee: listUser
    });
})
const search = catchAsync(async (req, res, next) => {
    const key = new RegExp(req.params.key)
    const List = await userService.searchUser(key)
    res.status(httpStatus.OK).json({
        success: true,
        employee: List
    });
})
const detail = catchAsync(async (req, res, next) => {
    const users = await User.findById(req.params.id)

        if(!users){
            return res.status(500).json({
                success: false,
                message: 'No product existed'
            });
        }
        res.json({
            success: true,
            employee: users
        });
})
module.exports = {
    listUser,
    search,
    detail
}
