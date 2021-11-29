const express = require('express')
const { authController, cartController } = require('../../controllers')
const validate = require('../../../middlewares/validate')

const router = express.Router()
router.get('/', cartController.list)
router.get('/:key', cartController.search)
router.get('/detail/:id', cartController.view)

module.exports = router
