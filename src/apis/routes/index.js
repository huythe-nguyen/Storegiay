const express = require('express')

const authRoute = require('./v1/auth.route')
const userRoute = require('./v1/user.route')
const projectRoute = require('./v1/product.route')
const brandRoute = require('./v1/brand.route')
const newRoute = require('./v1/new.route')
const oderRoute = require('./v1/oder.route')
const cartRoute = require('./v1/cart.route')

const projectRouteUser = require('./v2/product.route')
const cartRouteUser = require('./v2/cart.route')
const router = express.Router()

const defaultRoutes = [
    {
        path: '/v1/auth',
        route: authRoute,
    },
    {
        path: '/v1/users',
        route: userRoute,
    },
    {
        path: '/v1/admin/product',
        route: projectRoute,
    },
    {
        path: '/v1/admin/brand',
        route: brandRoute,
    },
    {
        path: '/v1/admin/new',
        route: newRoute,
    },
    {
        path: '/v1/admin/oder',
        route: oderRoute,
    },
    {
        path: '/v1/admin/cart',
        route: cartRoute,
    },
    {
        path: '/v1/user/product',
        route: projectRouteUser,
    },
    {
        path: '/v1/cart',
        route: cartRouteUser,
    },
]


defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)

})

module.exports = router
