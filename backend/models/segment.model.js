const mongoose = require('mongoose');

const { Schema } = mongoose;

const segmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    customerSize: {
        type: Number,
        default: 0
    },
    customerIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    }]
});

module.exports = mongoose.model('Segment', segmentSchema);