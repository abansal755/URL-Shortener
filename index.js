const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const AppError = require('./utils/AppError');
const wrapAsync = require('./utils/wrapAsync');
const URL = require('./models/URL');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const Radix = require('radix.js');
const radix = new Radix('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

const PORT = process.env.PORT || 3000;

if(process.env.NODE_ENV === 'production'){
    const sslServer = https.createServer({
        key: fs.readFileSync(path.join(__dirname, '../cert/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../cert/cert.pem'))
    }, app);
    sslServer.listen(PORT,() => console.log(`Listening to port ${PORT} ...`));
}
else app.listen(PORT,() => console.log(`Listening to port ${PORT} ...`));

(async function(){
    try{
        const DB_URL = process.env.DB_URL || 'mongodb://localhost/URLShortener';
        await mongoose.connect(DB_URL);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
})();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res) => {
    res.render('index');
})

app.post('/', wrapAsync(async (req,res) => {
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

app.get('/:shortened', wrapAsync(async (req,res) => {
    const {shortened} = req.params;
    const urlDoc = await URL.findOne({shortened});
    if(!urlDoc) throw new AppError('Not Found', 404);
    urlDoc.redirects++;
    await urlDoc.save();
    res.redirect(urlDoc.url);
}))

app.use((req,res) => {
    throw new AppError('Not Found', 404);
})

app.use((err,req,res,next) => {
    const {message,status = 500} = err;
    res.status(status).render('error',{message, status});
})