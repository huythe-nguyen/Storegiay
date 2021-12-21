const httpStatus = require('http-status')
const paypal = require('paypal-rest-sdk')
const catchAsync = require('../../../utils/catch-async')
const axios = require('axios')
const { cartUserService } = require('../../services')
const { Cart } = require('../../models')
const Email = require('../../../utils/email')
const Product = require('../../models/product.model');

const addCart = catchAsync(async (req, res, next) => {
    try {
        const cart = await cartUserService.createCart(req.body)
        //cart:

        const url = `http://localhost:4200/tracking`;
        await new Email(cart, url).sendCartInfo();  //cart: id, user(id), phone, address, total, displayName, email, products[]

        res.status(httpStatus.CREATED).json({
            success: true,
            cart: cart
        });
    } catch (err) {
        console.log(err);
    }
})

let convertedTotalPrice;
let cart = {};
// let cart = {
//     "state": "unconfirmed",
//     "total": 5000000,
//     "displayName": "Sơ ri mộng tuyền",
//     "email": "trungdang29122000@gmail.com",
//     "phone": "0365236974",
//     "address": "So 1 VVN",
//     "createdAt": "2021-12-03T14:27:48.486+00:00",
//     "updatedAt": "2021-12-03T14:27:48.486+00:00",
//     "__v": 0,
//     "products": [
//         {
//             "product": "61a7703aa80b0db542e3afd2",
//             "quantity": 2
//         },
//         {
//             "product": "61a770daa80b0db542e3afeb",
//             "quantity": 1
//         }
//     ]
// };
paypal.configure({
    mode: 'sandbox',
    client_id:
        'AZzhmftVJIv3iXju6TUszfDdwrckx_U27BqfleVFGc2YZYwnpUOiGASuuW9kXFmrxO-TPM9tZk9srNTU',
    client_secret:
        'EJ1gIFQT9jVMpMFLgJeFSaj0Ys0Mp3x_LeAz_z-0fROccjRp0nqgA8Dr9dLz8gzkJao0dMIcqk42-H_v',
});
const addCartPayPal = catchAsync(async (req, res, next) => {
    try {
        // cart = {};                                                      //đóng tạm thời
        cart = req.body;                                                //đóng tạm thời
        console.log('cart', cart);

        // Chuyển VND sang USD
        const exchangeUrl =
            'https://openexchangerates.org/api/latest.json?app_id=1660c56ea4cc47039bcd5513b6c43f1a';
        const asyncGetRates = async () => {
            const data = await axios.get(exchangeUrl);
            return data.data.rates.VND;
        };
        const exchangeRate = await asyncGetRates();
        // console.log('check exchangeRate: ', exchangeRate);

        let items = [];
        for await (const prod of cart.products) {
            let product = await Product.findById(prod.product);
            items.push({
                name: product.productName,
                sku: product.id,
                price: Math.round(product.priceSale / exchangeRate),
                currency: 'USD',
                quantity: prod.quantity
            })
        }

        //items = [...productsInCart];
        //console.log('items: ', items);

        convertedTotalPrice = 0;
        for (i = 0; i < items.length; i++) {
            convertedTotalPrice += parseFloat(items[i].price) * items[i].quantity;
        }

        // 4) tạo biến mẫu paypal để giao dịch có items, total là convertedItems, convertedTotalPrice đã tính ở trên
        var create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                // return_url: `${req.protocol}://${req.get('host')}/api/v1/pay/success`,
                // cancel_url: `${req.protocol}://${req.get('host')}/api/v1/pay/cancel`,
                return_url: "http://localhost:3000/api/v1/cart/success",
                // return_url: "http://localhost:4200/successPayPal",
                cancel_url: "http://localhost:3000/api/v1/cart/cancel",
            },
            transactions: [
                {
                    item_list: {
                        items
                    },
                    amount: {
                        currency: 'USD',
                        total: convertedTotalPrice,
                    },
                    description: 'Thanh toan don hang bang Papal o shop ban giay',
                },
            ],
        };

        // 5) chuyển đến trang giao dịch;
        paypal.payment.create(create_payment_json, (error, payment) => {
            //   console.log('check payment: ', payment);
            if (error) {
                //   console.log(error.response.details);
                //return next(new AppError('Something went wrong while paying', 400));
                return
                // res.render('cancel');
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        //  res.redirect(payment.links[i].href);    //

                        res.json({
                            forwardLink: payment.links[i].href,      //bỏ cmt   //ben FE ong co gan ten json dung la forwardLink ko
                        });
                    }
                }
                //  console.log('show payment: ', payment);     //console log gi ma nhieu du day
            }
        });

    } catch (err) {
        //console.log(err);
    }
})

const getSuccess = catchAsync(async (req, res) => {     //hinh nhu no loi cho nay
    //  console.log('convertedTotalPrice (success): ', convertedTotalPrice);
    // console.log('fizh', req)
    // try {

    //     // 1) lấy thông tin thanh toán
    //     const payerId = req.query.PayerID;
    //     const paymentId = req.query.paymentId;

    //     const execute_payment_json = {
    //         payer_id: payerId,
    //         transactions: [
    //             {
    //                 amount: {
    //                     currency: 'USD',
    //                     total: convertedTotalPrice,
    //                 },
    //             },
    //         ],
    //     };
    //     //http://localhost:3000/api/v1/cart/success?paymentId={PAYMENT_UD}&token={TOKEN}&PayerID={PAYER_ID}
    //     //thấy thiếu thiếu cái gì á, đợi xíu để qua code tui coi

    //     // 2) thanh toán !
    //     paypal.payment.execute(
    //         paymentId,
    //         execute_payment_json,
    //         async function (error, payment) {
    //             if (error) {
    //                 console.log(error.response);
    //                 throw error;
    //                 res.render('cancel');
    //             } else {
    //                 console.log('Get payment response: ');
    //                 //   console.log(JSON.stringify(payment));

    //                 //  const cartss = await cartUserService.createCart(cart);
    //                 console.log(cart);
    //                 res.render('success');
    //             }
    //         }
    //     );
    // } catch (error) {
    //     console.log('success error', error);
    // }
})

const getCancel = catchAsync(async (req, res) => {
    res.send('Cancelled payment');
})

const viewCart = catchAsync(async (req, res) => {
    const userId = req.params.userId
    const cart = await cartUserService.view(userId);

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'No cart existed'
        });
    }
    res.json({
        carts: cart
    })
})
const viewGuestCart = catchAsync(async (req, res, next) => {
    console.log(req);
    const product = await Cart.findById(req.params.id);
    console.log(product);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'No cart existed'
        });
    }
    res.json({
        success: true,
        cart: product,
    });
})
const viewUpdate = catchAsync(async (req, res) => {
    const id = req.params.id
    const cart = await cartUserService.viewUpdate(id);
    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'No cart existed'
        });
    }
    res.json({
        cart: cart
    })
})
const viewAllCart = catchAsync(async (req, res, next) => {
    try {
        const product = await cartUserService.viewAllCart();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'No cart existed'
            });
        }
        res.json({
            success: true,
            carts: product,
        });
    } catch (err) {
        console.log(err);
    }
})

const updateCart = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const cart = await cartUserService.updateCart(id, req.body)
    res.status(httpStatus.OK).json({
        success: true,
        cart: cart
    });
})

const deleteCart = catchAsync(async (req, res) => {
    const id = req.params.id
    const product = await cartUserService.deleteCart(id)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Cart is delete'
    });
})

module.exports = {
    addCart,
    addCartPayPal,
    getSuccess,
    getCancel,
    viewCart,
    viewAllCart,
    updateCart,
    deleteCart,
    viewUpdate,
    viewGuestCart,
}
