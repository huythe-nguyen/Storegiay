const { constants } = require('crypto');
const express = require('express')
const { cartControllerUser } = require('../../controllers')
const ejs = require('ejs');
const router = express.Router() //
router.get(    //
    '/view',
    function (req, res) {
        res.render('index')
    }
);
router.get('/', cartControllerUser.viewAllCart)  //
router.get('/detail/:userId', cartControllerUser.viewCart) //
router.get('/edit/:id', cartControllerUser.viewUpdate) //
router.put('/edit/:id', cartControllerUser.updateCart) //
router.delete('/:id', cartControllerUser.deleteCart)   //
router.post('/add', cartControllerUser.addCart)    //
router.get('/:id', cartControllerUser.viewGuestCart)


router.post('/addPayPal', cartControllerUser.addCartPayPal)
router.get('/success', cartControllerUser.getSuccess);
router.get('/cancel', cartControllerUser.getCancel);



module.exports = router
