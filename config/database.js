const mongoose = require('mongoose');

module.exports = async function(){
    try{
        const DB_URL = process.env.DB_URL || 'mongodb://localhost/URLShortener';
        await mongoose.connect(DB_URL);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}