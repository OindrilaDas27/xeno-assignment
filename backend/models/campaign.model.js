const mongoose = require('mongoose');
const { Schema } = mongoose;

const campaignSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    segmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Segment'
    },
    status: {
        type: Number,
        max: 100,
        min: 50
    },
    messageTemplate: { 
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Campaign', campaignSchema);