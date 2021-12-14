const express = require('express')
const {  cartControllerUser } = require('../../controllers')

const router = express.Router()

router.post('/add', cartControllerUser.addCart)
router.get('/', cartControllerUser.viewAllCart)
router.get('/detail/:userId', cartControllerUser.viewCart)
router.get('/edit/:id', cartControllerUser.viewUpdate)
router.put('/edit/:id', cartControllerUser.updateCart)
router.delete('/:id', cartControllerUser.deleteCart)



module.exports = router
