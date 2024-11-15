const mongoose = require('mongoose')
const { Schema } = mongoose;

const messgaeSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign'
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    customerName: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        max: 100,
        min: 50
    }
});

module.exports = mongoose.model('Message', messgaeSchema);