const express = require('express');
const middleware = require('../middlewares/auth');
const router = express.Router();


router.use(middleware);

router.get('/', async(req, res) =>{
    return res.status(200).send({ok: 'true', user: req.userId});
});

module.exports = app => app.use('/projects', router);