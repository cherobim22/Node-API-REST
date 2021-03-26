const mongoose = require('mongoose');
const access = require('../config/uri.json');

const url = access.uri;

mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
module.exports = mongoose;