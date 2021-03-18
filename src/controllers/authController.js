const Usuario = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'var.env'});
const { validationResult } = require('express-validator');


exports.userAuthentication = async (req, res, next) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    // buscar el usuario para ver si esta registrado
    const { email, password } = req.body;
    const user = await Usuario.findOne({email});

    if (!user) {
        res.status(401).json({message: 'El usuario no existe'});
        return next();
    }

    // verificar el password y autenticar el usuario
    if (bcrypt.compareSync(password, user.password)) {
        //  crear jwt
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role
        }, process.env.SECRET, {
            expiresIn: '48h',
        } );

        res.json(token);

    } else {
        res.status(401).json({message:'Password Incorrecto'});
        return next();
    }

}

exports.userAuthenticate = async (req, res, next) => {
    res.json({user: req.user});
}