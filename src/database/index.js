const mongoose = require('mongoose');
const path = require('path');
require('dotenv/config');

const url = process.env.URI;

mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
module.exports = mongoose;