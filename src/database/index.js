const mongoose = require('mongoose');
const path = require('path');
// const access = require('../config/uri.json');

require('dotenv/config');
// console.log(process.env);
const url = process.env.URI;


mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
module.exports = mongoose;