const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    duration: {
        type: String,
        required: false
    },
    includes: {
        type: [String],
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Package', packageSchema);
