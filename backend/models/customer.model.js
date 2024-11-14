const mongoose = require('mongoose');

const { Schema } = mongoose;

const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    orderIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    countVisits: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Customer', customerSchema);