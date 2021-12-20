const { date } = require('joi');
const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins')


const userOderSchema = mongoose.Schema(
    {
        lastName: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        dateOder: {
            type: Date,
            default: Date.now,
        },
        price: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'unconfimed'
        },
        idCart:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart',
        },
        idUser:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
)
userOderSchema.plugin(toJSON)
userOderSchema.plugin(paginate)
userOderSchema.index({'$**': 'text'});




/**
 * @typedef Oder
 */
const Oder = mongoose.model('Oder', userOderSchema)

module.exports = Oder
