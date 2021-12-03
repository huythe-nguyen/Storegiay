const express = require('express')
const { authController, userController } = require('../../controllers')
const validate = require('../../../middlewares/validate')

const router = express.Router()

router.get('/', userController.listUser)
router.get('/:key', userController.search)
router.get('/detail/:id', userController.detail)
router.put('/detail/:id', userController.update)

module.exports = router
