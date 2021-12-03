const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

var ProductSchema = new Schema ({
    id: Number,
    storeId: {
        type: Schema.Types.Number,
        ref: 'StoreSchema'
    },
    category: Number,
    name: String,
    quantity: Number,
    price: Number,
    description: String,
    image: String,
    comments:[{
        type:Schema.Types.Number,
        ref:'CommentSchema'
    }]
})

autoIncrement.initialize(mongoose.connection);
ProductSchema.plugin(autoIncrement.plugin, {model : 'ProductSchema', field: "id"});

var ProductSchema = mongoose.model('ProductSchema', ProductSchema);

module.exports = ProductSchema;