const mongoose = require('mongoose');

const { Schema } = mongoose;

const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    totalSpending: {
        type: Number,
        default: 0
    },
    countVisits: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Customer', customerSchema);