const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

var OrderSchema = new Schema({
    id: Number,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    orderDate: String,
    total: Number,
    orderStatus: String,
    paymentStatus: String
})

autoIncrement.initialize(mongoose.connection);
OrderSchema.plugin(autoIncrement.plugin, {model : 'OrderSchema', field: "id"});

var OrderSchema = mongoose.model('OrderSchema', OrderSchema);

module.exports = OrderSchema;
