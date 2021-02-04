const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newUser = async (req, res) => {    

    // mostrar mensajes de error de express validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    // verificar si el usuario ya estuvo registrado
    const { email, username, password } = req.body;

    let userEmail = await User.findOne({ email });
    let userName = await User.findOne({ username });

    if (userEmail) {
        return res.status(400).json({message: `Ya existe un usuario con este email`});
    } else if (userName) {
        return res.status(400).json({message: `Ya existe un usuario con este username`});
    } 

    // crear usuario

    const user =  new User(req.body);
    
    // hashear el password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    try {
        await user.save();
        res.json({message: 'Usuario creado correctamente'});
    }   catch(error) {
        console.log(error);
    }
};

exports.getUser = async (req, res) => {
    const {id} = req.params;
    try {
        let user = await User.findById(id);
        res.json({user});
    } catch(error) {
        console.log(error);
        res.json({message: 'No se encontró el usuario o hubo un problema'});
    }
};