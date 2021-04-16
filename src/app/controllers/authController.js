const express = require('express');
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth.json');
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

router.post('/forgot', async(req, res)=>{
    const {email} = req.body;

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).send({error: "usuario não encontrado"});
        }

        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours()+1);

        await User.findByIdAndUpdate(user.id, {
            '$set':{
                passwordResetToken: `${token}`,
                passwordResetExpires: now
            }
        });
        mailer.sendMail({
           
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: "bar@example.com, baz@example.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `<b>Hello world? ${ token }</b>`,

        }, (err)=>{
            if(err){
                console.log(err)
                return res.status(400).send({error: "Não foi possivel enviar o email de recuperação de senha"});
            }

            return res.send()
        });

    }catch{
        return res.status(400).send({error: "erro inesperado, tente novamente"});
    }
});

router.post('/reset', async(req, res)=>{

    const {email, token, password} = req.body;

    try{
        const user = await User.findOne({email})
        .select('+passwordResetToken passwordResetExpires');

        if(!user){
            return res.status(400).send({error: "usuario não encontrado"});
        }
        if(token !== user.passwordResetToken){
            console.log(token);
            console.log(user.passwordResetToken);
            return res.status(400).send({error: "Token invalido"});
        }
        const now = new Date();
        if(now > user.passwordResetExpires){
            return res.status(400).send({error: "Token expirado"});
        }

        user.password = password;

        await user.save();

        return res.send();

    }catch(err){
        console.log(err)
        return res.status(400).send({error: "Não foi possivel resetar a senha"});
    }
});



module.exports = app => app.use('/auth', router);