const express = require('express');
const app = express();

const path = require('path');
const AppError = require('./utils/AppError');
const https = require('https');
const fs = require('fs');
const router = require('./routes');
const database = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

if(process.env.NODE_ENV === 'production'){
    const sslServer = https.createServer({
        key: fs.readFileSync(path.join(__dirname, '../cert/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../cert/cert.pem'))
    }, app);
    sslServer.listen(PORT,() => console.log(`Listening to port ${PORT} ...`));
}
else app.listen(PORT,() => console.log(`Listening to port ${PORT} ...`));

database();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use(router);

app.use((req,res) => {
    throw new AppError('Not Found', 404);
})

app.use((err,req,res,next) => {
    const {message,status = 500} = err;
    res.status(status).render('error',{message, status});
})