const express = require('express')
const { OrderControllerUser, oderController } = require('../../controllers')
const validate = require('../../../middlewares/validate')

const router = express.Router()
router.post('/add', oderController.add)
router.get('/:status', oderController.list)
router.get('/', oderController.search)
router.get('/edit/:id', oderController.view)
router.get('/total/:state', oderController.total)
router.put('/edit/:id', oderController.exit)
router.get('/count/:state', oderController.count)

module.exports = router
