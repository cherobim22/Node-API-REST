const express = require('express');
// const bodyParser = require('body-parser')
const app = express();

// app.use(express.bodyParser());

require('./controllers/authController')(app);

app.listen(3333);