const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
    cost: {
        type: Number,
        require: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Order', orderSchema);