const mongoose = require('mongoose');

const { Schema } = mongoose;

const segmentSchema = new Schema({
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
    }
});

module.exports = mongoose.model('Segment', segmentSchema);