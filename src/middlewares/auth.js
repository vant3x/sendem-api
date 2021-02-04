const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'var.env'});

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (authHeader) {
        // obtener token 
        const token = authHeader.split(' ')[1];
        // comprobar el jwt
        try {
            const user = jwt.verify(token, process.env.SECRET);
            req.user = user;
        } catch(error) {
          console.log(error);
          console.log('JWT no valido');
          res.status(401).json({message: 'El jwt no es valido'})
        }
    }    
    return  next()
} 