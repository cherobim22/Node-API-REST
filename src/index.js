const express = require('express');
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express();

app.use(cors());
app.use('/uploads', express.static('uploads'));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}))/


require('./app/controllers/index')(app);

app.listen(3333);
console.log("filé");