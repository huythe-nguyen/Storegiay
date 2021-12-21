const { number, string } = require('joi')
const mongoose = require('mongoose')
const validator = require('validator')

const { toJSON, paginate } = require('./plugins')

const cartSchema = mongoose.Schema(
    {
        userId: {
            type: String,
        },
        codeOder: {
            type: String,
        },
        state: {
            type: String,
            default: 'unconfirmed',
            required: true,
        },
        products: [{
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            productCode: {
                type: String,
            },
            productName: {
                type: String,
            },
            colour: {
                type: String,
            },
            size: {
                type: Number,
            },
            price: {
                type: Number,
            },
            Total: {
                type: Number,
            }
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
        },
        country: {
            type: String
        },
        city: {
            type: String,
            trim: true,
        },
        stateOrder: {
            type: String,
        },
        timeOrder: {
            type: Date,
            default: Date.now()
        }
    },
    {
        timestamps: true,
    }
)

cartSchema.plugin(toJSON)
cartSchema.index({ '$**': 'text' });

/**
 * @typedef Product
 */
const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart
