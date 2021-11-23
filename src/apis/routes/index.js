const express = require('express')

const authRoute = require('./v1/auth.route')
const userRoute = require('./v1/user.route')
const projectRoute = require('./v1/product.route')
const brandRoute = require('./v1/brand.route')
const newRoute = require('./v1/new.route')

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
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)

})

module.exports = router
