const nodemailer = require('nodemailer');

var sendMail  = (req, res, next) => {
    var transporter =  nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: "thehuynguyen91@gmail.com",
            pass: "the01885896698"
        }
    });
    var mainOptions = {
        from: 'thehuynguyen91@gmail.com',
        to: req.body.email,
        subject: 'Xác nhận đơn hàng ' + req.body.id,
        text: 'Cảm ơn bạn đã sử dụng dịch vụ mua sắm trực tuyến của nhóm 2 CNPMM',
        html: '<ul><li>Mã đơn hàng:'+req.body.id+'</li><li>Tổng tiền: '+req.body.total+'</li><li>Trạng thái đơn hàng: '+req.body.orderStatus+'</li><li> Trạng thái thanh toán: '+req.body.paymentStatus+'</li><li>Ngày đặt hàng: '+req.body.orderDate+'</li></ul>'
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
            return res.status(404).json({mess: err});
        } else {
            console.log('Message sent: ' +  info.response);
            return res.status(201).json({mess: 'Order successfully'});
        }
    });
}

module.exports = {
    sendMail
}
