const httpStatus = require('http-status')
const catchAsync = require('../../../utils/catch-async')
const { productUserService } = require('../../services/client/product.service')
const { Product } = require('../../models')
const { string } = require('joi')
const APIFeatures = require('../../../utils/api-feature')



const listProduct = catchAsync(async (req, res, next) => {
    const lengthOrigin = (await Product.find()).length;

    //executing query
    const features = new APIFeatures(
        Product.find(),
        req.query,
        lengthOrigin
    ).filter()
        .paginate().sort();
    // const docs = await features.mongooseQuery.explain();
    const docs = await features.mongooseQuery;

    //Send response
    res.status(200).json({
        status: 'success',
        results: docs.length,
        data: {
            data: docs,
        },
    });

})



const viewProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    const productsSize = await Product.find({ productName: product.productName }).select('size');
    console.log('productsSize: ', productsSize)
    // let sizes = [];
    // productsSize.forEach(p => sizes.push(p.size));
    if (!product) {
        return res.status(500).json({
            success: false,
            message: 'No product existed'
        });
    }
    res.json({
        success: true,
        product: product,
        productsSize: productsSize,
    });
})

const filterProduct = catchAsync(async (req, res, next) => {
    console.log(req.body);
    productUserService.filterProduct(req.body.category, req.body.brand, req.body.priceMin, req.body.priceMax, req.body.size).then(products => {
        if (products) {
            return res.status(200).json({
                success: true,
                message: 'The product is filtered',
                product: products
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'product not Found'
            });
        }
    }).catch(error => {
        return res.status(500).json({
            success: false,
            error: error
        });

    })
})

const searchProduct = catchAsync(async (req, res) => {
    productUserService.searchProduct(req.body.productName).then(products => {
        if (products) {
            return res.status(200).json({
                success: true,
                message: 'The product is searched',
                product: products
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'product not Found'
            });
        }
    }).catch(error => {
        return res.status(500).json({
            success: false,
            error: error
        });
    });
})
const list = catchAsync(async (req, res, next) => {
    const key = req.query.key
    const productList = await Product.find(key)
    res.status(httpStatus.OK).json({
        success: true,
        product: productList
    });
})
module.exports = {
    listProduct,
    viewProduct,
    filterProduct,
    searchProduct,
    list
}
