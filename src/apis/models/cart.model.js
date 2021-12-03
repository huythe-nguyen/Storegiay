const { number, string } = require('joi')
const mongoose = require('mongoose')
const validator = require('validator')

const { toJSON, paginate } = require('./plugins')

const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        state: {
            type: String,
            default: 'unconfirmed',
            required: true,
        },
        products: [{
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true,
        }],
        total: {
            type: Number,
            required: true,
        },
        displayName: {
            type: String,
        },
        email: {
            type: String
        },
        phone: {
            type: Number
        },
        address: {
            type: String
        }
    },
    {
        timestamps: true,
    }
)

cartSchema.plugin(toJSON)
cartSchema.index({'$**': 'text'});

/**
 * @typedef Product
 */
const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart
