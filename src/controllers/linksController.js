const Links = require('../models/Link');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newLink = async (req, res, next) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    // crear un objecto de link
     const { original_name, fileName  } = req.body;

     const link = new Links();
    link.url = shortid.generate();
    link.fileName = fileName;
    link.originalName = original_name;

    // si el usuario esta autenticado
    if (req.user) {
        const { password, download_limit } = req.body;

        // asignar a link numero de descargar y password
        if (download_limit) {
            link.downloadLimit = download_limit;
        }  

        // encriptar  y guardar password archivos si existe un usuario
        if (password) {
            const salt = await bcrypt.genSalt(10);
            link.password = await bcrypt.hash(password, salt);
        }

        // asignar el autor
        link.author = req.user.id;
    }

    // almacenar  en la base de datos
    try {
        await link.save();
        res.json({message: `${link.url}`});
        return next();
    } catch (error) {
        console.log(error);
        res.json(error);
    }   

};


exports.getLinks = async (req, res, next) => {
    try {
        const links = await Links.find({}).select('url');
        res.json({links: links});
    } catch(error) {

    }
}


// getlinks by user 
exports.getLinksByUser = async (req, res, next) => {
    try {
        const links = await Links.find({author: req.params.idUser}).sort({created_at: -1});
        res.json({links: links});
    } catch(error) {

    }
}

// retorna si el link tiene password
exports.hasPassword = async (req, res, next) => {
    // verificar si existe el link
    const link = await Links.findOne({url: req.params.url});

    if (!link) {
        res.status(404).json({message: 'Ese enlace no existe'});
        return next();
    }

    if (link.password) {
        return res.json({...link._doc, password: true, link: link.url})
    } 

    next();
}

// verifica si el password es correcto
exports.verifyPassword = async (req, res, next) => {
    const { url } = req.params;
    const { password } = req.body;
    // consultar por el enlace
    const link = await Links.findOne({url});
    // verificar  el password
    if (bcrypt.compareSync(password, link.password)) {
        // permitir descargar el archivo
        next();
    } else {
        res.status(401).json({message: 'Password incorrecto'});
    }

}

exports.getLink = async (req, res, next) => {
    // verificar si existe el link
    const link = await Links.findOne({url: req.params.url});

    if (!link) {
        res.status(404).json({message: 'Ese enlace no existe'});
        return next();
    }

    // si el link existe
    res.json({...link._doc, file: link.fileName, password: false});

    next();
}

