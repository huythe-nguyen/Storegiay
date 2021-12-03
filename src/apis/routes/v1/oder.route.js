const express = require('express')
const { OrderControllerUser, oderController } = require('../../controllers')
const validate = require('../../../middlewares/validate')

const router = express.Router()
router.post('/add', oderController.add)
router.get('/:status', oderController.list)
router.get('/search', oderController.search)
router.get('/edit/:id', oderController.view)
router.put('/edit/:id', oderController.exit)
router.get('/count/:status', oderController.count)
router.post('/order', OrderControllerUser.createOrder)

module.exports = router
