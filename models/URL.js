const mongoose = require('mongoose');

const URLSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    shortened: {
        type: String,
        required: true
    },
    redirects: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('URL', URLSchema);