const express = require('express');
const bodyParser = require('bodyParser')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}))


app.listen(3333);
console.log("rodanado la na 3333")