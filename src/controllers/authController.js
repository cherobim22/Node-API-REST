const express = require('express');
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json')
const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    });

}

router.post("/register", async(req, res) =>{

    const {email} = req.body;
    try{
        const a = await User.findOne({email}).exec();
        if(a){
            return res.status(400).send({error: 'Um usuario com este email ja existe'});
        }
        const user = await User.create(req.body);

        user.password = undefined;

        const token = generateToken({id: user.id});

        return res.send({user, token});

    }catch (err){
        console.log(err);
        return res.status(400).send({error: "Falha no registro"});
    }
})


router.post("/authenticate", async (req, res) =>{
    const {email, password} = req.body;

    const user = await User.findOne({email}).select('+password');

    if(!user){
        return res.status(400).send({error: "usuario não encontrado"});
    }

    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({error: "senha invalida"});
    }

    user.password = undefined;

    const token = generateToken({id: user.id});

    return res.status(200).send({user, token });
});



module.exports = app => app.use('/auth', router);