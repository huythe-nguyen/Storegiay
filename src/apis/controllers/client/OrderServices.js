const {Order}  =  require('../../models');
const {OrderDetail} = require('../../models');
const Product  = require('../../models');
const {sendMail} = require('../../services/client/MailService')
const User = require('../../models');

var createOrder = (req, res, next) => {
    const date = new Date();
    const dateString = date.getDate()+"-"+date.getMonth()+1+"-"+date.getFullYear();
    req.body.orderDate = dateString;
    req.body.orderStatus = "Đặt hàng thành công";
    req.body.paymentStatus = "Chưa thanh toán";
    var order = new Order(req.body);

    const listProducts =req.body.listProducts;
    const listQuantities = req.body.listQuantities;
    const listDescription = req.body.listDescription;
    const listProductNames = req.body.listProductNames;
    const listPrices = req.body.listProductNames;

    order.save((err, result) => {
        if(err) return res.status(404).json({mess: err});
        for (let i = 0; i < listProducts.length; i++) {
            var orderDetail = new OrderDetail();
            orderDetail.orderId = result.id;
            orderDetail.productId = listProducts[i];
            orderDetail.quantity = listQuantities[i];
            orderDetail.description = listDescription[i];
            orderDetail.productName= listProductNames[i];
            orderDetail.price = listPrices[i];
            orderDetail.date = dateString;
            orderDetail.status = "Chưa chuẩn bị";

            orderDetail.save((err) => {
                if(err) return res.status(404).json({mess: err});
            })
        }
        req.body.id = result.id;
        User.findOne({id: req.body.userId}, (err, user) => {
            if(err) return res.status(404).json({mess: err});
            req.body.email = user.email;
            sendMail(req, res, next);
        })


    })

}

var viewOrderHistoryByUserId = (req, res, next) => {
    Order.find({userId: req.params.id}, (err, orders) => {
        if(err) return res.status(404).json({mess: err});
        res.status(200).json(orders);
    })
}

var viewOrderDetailByOrderId = (req, res, next) => {
    OrderDetail.find({orderId: req.params.id}, (err, orderDetail) => {
        if(err) return res.status(404).json({mess: err});
        return res.status(200).json(orderDetail) ;
    })
}


var getOrderByStoreId = (req, res, next) => {
    Product.find({storeId: req.params.id}, async (err, products) => {
        if(err) return res.status(404).json(err);
        let listOrderDetail = [];
        for (const product of products) {
            const obj = await OrderDetail.find({$and: [{productId: product.id},{status: 'Chưa chuẩn bị'}]});
            obj.forEach((o) => {
                listOrderDetail.push(o);
            })
        }

        return res.status(200).json(listOrderDetail);
    })
}

var getOrderByStoreIdAndDate = (req, res, next) => {
    Product.find({storeId: req.params.id}, async (err, products) => {
        if(err) return res.status(404).json(err);
        let listOrderDetail = [];
        for (const product of products) {
            const obj = await OrderDetail.find({$and: [{productId: product.id},{date: req.params.date},{status: "Đang chuẩn bị"}]});
            obj.forEach((o) => {
                listOrderDetail.push(o);
            })
        }

        return res.status(200).json(listOrderDetail);
    })
}

var payment = (req, res, next) => {
    Order.findOne({id: req.params.id}, (err, order) => {
        if(err) return res.status(404).json({mess: err});
        order.paymentStatus = "Đã thanh toán";
        order.save((err, result) => {
            if(err) return res.status(404).json({mess: err});
            return res.status(200).json({mess: 'Thanh toán thành công'});
        })
    })
}

var updateOrderStatus = (req, res, next) => {
    Order.findOne({id: req.params.id}, (err, order) => {
        if(err) return res.status(404).json({mess: err});
        order.orderStatus = "Đơn hàng đã chuẩn bị xong";
        order.save((err, result) => {
            if(err) return res.status(404).json({mess: err});
            return res.status(200).json({mess: "Update order status successfully"});
        })
    })
}

var updateOrderDetailStatus = (req, res, next) => {
    OrderDetail.findOne({id: req.params.id}, (err, orderDetail) => {
        if(err) return res.status(404).json({mess: err});
        orderDetail.status = "Đang chuẩn bị";
        orderDetail.save((err, result) => {
            if(err)  return res.status(404).json({mess: err});
            OrderDetail.find({orderId: orderDetail.orderId}, (err, orderDetails) => {
                if(err) return res.status(404).json({mess: err});
                for (const orderDetail of orderDetails) {
                    if(orderDetail.status === 'Chưa chuẩn bị'){
                        return res.status(200).json({mess: 'Update order detail status successfully'});
                    }
                }
                req.params.id = orderDetail.orderId;
                updateOrderStatus(req, res, next);
            })
        })
    })
}

var getAllOrder = (req, res, next) => {
    Order.find({}, (err, orders) => {
        if(err) return res.status(404).json({mess: err});
        return res.status(200).json(orders);
    })
}

var getAllOrderWithNonePaymentStatus = (req, res, next) => {
    Order.find({paymentStatus: 'Chưa thanh toán'}, (err, orders) => {
        if(err) return res.status(404).json({mess: err});
        return res.status(200).json(orders);
    })
}

var getOrderByStoreIdAndDateOptions = (req, res, next) => {
    Product.find({storeId: req.params.id}, async (err, products) => {
        if(err) return res.status(404).json(err);
        let listOrderDetail = [];
        for (const product of products) {
        const obj = await OrderDetail.find({$and: [{productId: product.id},{date: {$regex: `-${req.params.month}-${req.params.year}`}}, {status: "Đang chuẩn bị"}]});
            obj.forEach((o) => {
                listOrderDetail.push(o);
            })
        }

        return res.status(200).json(listOrderDetail);
    })
}

var getOrderByStoreIdAndStatusFinished  = (req, res, next) => {
    Product.find({storeId: req.params.id}, async (err, products) => {
        if(err) return res.status(404).json(err);
        let listOrderDetail = [];
        for (const product of products) {
            const obj = await OrderDetail.find({$and: [{productId: product.id},{status: "Đang chuẩn bị"}]});
            obj.forEach((o) => {
                listOrderDetail.push(o);
            })
        }

        return res.status(200).json(listOrderDetail);
    })
}

module.exports = {
    createOrder,
    viewOrderHistoryByUserId,
    viewOrderDetailByOrderId,
    getOrderByStoreId,
    getOrderByStoreIdAndDate,
    payment,
    updateOrderStatus,
    updateOrderDetailStatus,
    getAllOrder,
    getAllOrderWithNonePaymentStatus,
    getOrderByStoreIdAndDateOptions,
    getOrderByStoreIdAndStatusFinished
}
