const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router();
const AppError = require('../utils/AppError');
const URL = require('../models/URL');
const radix = require('../config/radix');

router.get('/', (req,res) => {
    res.render('index');
})

router.post('/', wrapAsync(async (req,res) => {
    const {url} = req.body;
    if(!url) throw new AppError('URL not specified', 400);
    let urlDoc = await URL.findOne({url});
    if(!urlDoc){
        const shortened = radix.convent(Date.now(),10,62);
        urlDoc = new URL({url, shortened});
        await urlDoc.save();
    }
    const domain = process.env.DOMAIN || 'localhost:3000';
    res.render('shortened',{urlDoc, domain});
}))

router.get('/:shortened', wrapAsync(async (req,res) => {
    const {shortened} = req.params;
    const urlDoc = await URL.findOne({shortened});
    if(!urlDoc) throw new AppError('Not Found', 404);
    urlDoc.redirects++;
    await urlDoc.save();
    res.redirect(urlDoc.url);
}))

module.exports = router;