const mongoose = require('mongoose');
const validUrl = require('valid-url');
const AppError = require('../utils/AppError');

const URLSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true,
    },
    shortened: {
        type: String,
        required: true,
        unique: true
    },
    redirects: {
        type: Number,
        default: 0
    }
});

URLSchema.pre('validate', (next) => {
    if(validUrl.isWebUri(this.url)) next();
    else throw new AppError('Invalid URL', 400);
})

module.exports = mongoose.model('URL', URLSchema);