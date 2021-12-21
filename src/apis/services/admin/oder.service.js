const httpStatus = require('http-status')
const moment = require('moment')
const ApiError = require('../../../utils/api-error')
const { Cart, Product } = require('../../models')

/**
 * Create a product
 *@param {string} id
 * @param {Object} oderBody
 * @returns {Promise<Oder>}
 *
 */


const list = async (page, size, key) => {

    if (page) {
        pages = parseInt(page);
        if (pages < 1)
            pages = 1;

        sizes = parseInt(size);
        if (sizes < 5)
            sizes = 5;
        var skips = (pages - 1) * sizes;
        const list = await Cart.find({ state: key }).skip(skips).limit(sizes)
        return list
    } else {
        sizes = parseInt(size);
        if (sizes < 5)
            sizes = 5;
        const list = await Cart.find({ state: key }).limit(sizes)
        return list
    }


}
const viewDashboard = async (page, size, key, day) => {
    days = parseInt(day);
    console.log(days)
    if (days <= 0) {
        var today = moment().startOf('day');
        // "2018-12-05T00:00:00.00
        var tomorrow = moment(today).endOf('day');
        // ("2018-12-05T23:59:59.999
        if (page) {
            pages = parseInt(page);
            if (pages < 1)
                pages = 1;

            sizes = parseInt(size);
            if (sizes < 5)
                sizes = 5;
            var skips = (pages - 1) * sizes;
            const list = await Cart.find({ state: key, timeOrder: { '$gte': today, '$lte': tomorrow } }).skip(skips).limit(sizes)
            return list
        } else {
            sizes = parseInt(size);
            if (sizes < 5)
                sizes = 5;
            const list = await Cart.find({ state: key, timeOrder: { '$gte': today, '$lte': tomorrow } }).limit(sizes)
            return list
        }
    } else {
        var today = moment().subtract(days, 'day');
        var tomorrow = moment().endOf('day');
        // ("2018-12-05T23:59:59.999
        console.log(today)
        console.log(tomorrow)
        if (page) {
            pages = parseInt(page);
            if (pages < 1)
                pages = 1;

            sizes = parseInt(size);
            if (sizes < 5)
                sizes = 5;
            var skips = (pages - 1) * sizes;
            const list = await Cart.find({ state: key, timeOrder: { '$gte': today, '$lte': tomorrow } }).skip(skips).limit(sizes)
            return list
        } else {
            sizes = parseInt(size);
            if (sizes < 5)
                sizes = 5;
            const list = await Cart.find({ state: key, timeOrder: { '$gte': today, '$lte': tomorrow } }).limit(sizes)
            return list
        }
    }
}
const search = async (state, phone) => {
    const list = await Cart.find({ state: state, phone: phone });
    return list
}
const update = async (id, oderBody) => {
    const oders = await Cart.findById(id);
    console.log(oders.products)
    console.log(oderBody.state)
    if (oderBody.state === 'cancel') {
        for (let index = 0; index < oders.products.length; index++) {
            const element = oders.products[index];
            const product = await Product.findById(element.product)
            console.log(product)
            if (product) {
                product.amount = product.amount + element.quantity
                await product.save();
                console.log(product.amount)
            }
        }
        return oders.update(oderBody)
    }
    return oders.update(oderBody)
}

const counts = async (key,day) => {
    days = parseInt(day);
    console.log(days)
    if(days<=0){
        var today = moment().startOf('day');
        // "2018-12-05T00:00:00.00
        var tomorrow = moment(today).endOf('day');
        // ("2018-12-05T23:59:59.999
        const list = await Cart.find({ state: key, timeOrder: { '$gte': today, '$lte': tomorrow } }).count()
        return list
    }else{
        var today = moment().subtract(days,'day');
        // "2018-12-05T00:00:00.00
        var tomorrow = moment().endOf('day');
        // ("2018-12-05T23:59:59.999
        const list = await Cart.find({ state: key, timeOrder: { '$gte': today, '$lte': tomorrow } }).count()
        return list
    }
}
module.exports = {
    list,
    search,
    update,
    counts,
    viewDashboard
}
