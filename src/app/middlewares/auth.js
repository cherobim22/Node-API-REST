const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json'); 

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({error: "Nenhum token de acesso foi encontrado"});
    }
    
    jwt.verify(authHeader, authConfig.secret, (err, decoded) => {
        if(err){
            console.log(err);
            return res.status(401).send({error: "Token invalido ou expirado"});
        }

        req.userId = decoded.id;
        return next();
    });


}