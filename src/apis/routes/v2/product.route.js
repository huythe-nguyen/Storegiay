const express = require('express')
const { authController, productControllerUser } = require('../../controllers')
const { authValidation, productValidation } = require('../../validations')

const validate = require('../../../middlewares/validate')

const router = express.Router()

router.get('/filter', productControllerUser.filterProduct);
router.get('/search', productControllerUser.searchProduct);
router.get('/', productControllerUser.listProduct)
router.get('/:id', productControllerUser.viewProduct);

module.exports = router
