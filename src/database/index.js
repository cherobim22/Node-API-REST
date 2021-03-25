const mongoose = require('mongoose');

const url = "mongodb+srv://cherobim:9eXxVnsMFlCoplqk@cluster0.krk0w.mongodb.net/teste?retryWrites=true&w=majority";

mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
module.exports = mongoose;