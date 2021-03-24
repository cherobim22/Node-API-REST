const mongoose = require('mongoose');

const url = "mongodb+srv://cherobim:aoaGj1eq15sR71vX@cluster0.krk0w.mongodb.net/teste?retryWrites=true&w=majority";

mongoose.set('useFindAndModify', false);
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;