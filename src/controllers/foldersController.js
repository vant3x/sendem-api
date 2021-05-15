const Folders = require('../models/Folder');
const Links = require('../models/Link');
const shortid = require('shortid');
const { validationResult } = require('express-validator');

exports.newFolder = async (req, res, next) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    // crear un objecto de folder
     const { folderName  } = req.body;

     const folder = new Folders();
     folder.folderName = folderName;
     folder.path = `root/${folderName.replace(/ /g,"-").trim().toLowerCase()}/`;

    // si el usuario esta autenticado
    if (req.user) {
        // asignar el autor
        folder.author = req.user.id;
    }

    // almacenar  en la base de datos
    try {
        await folder.save();
        res.json({message: ` Se creó la carpeta ${folder.folderName}`});
        return next();
    } catch (error) {
        console.log(error);
        res.json(error);
    }   

};

// actualizar folder con archivos
exports.updateFilesFolder = async (req, res, next) => {
    // crear un objecto de folder
   
    // obtiene el folder
    const link = await Links.findOne({ fileName: req.body.fileName });
    const folder =  await Folders.findOne({ _id: req.body.folder });
    
    if (folder) {
       folder.path = `/${folder.folderName.replace(/ /g,"-").trim().toLowerCase()}/`;
       folder.files.push({file: link._id});
  
   
    } else {
       console.log({message:'no existe'})
       next();
    }

    try {
        await folder.save();
  
    }   catch (error) {
        console.log(error);
        res.json(error);
    }
      
    

     /*const folder = new Folders();
     folder.folderName = folderName;

    // si el usuario esta autenticado
    if (req.user) {
        // asignar el autor
        folder.author = req.user.id;
    }*/

};


exports.getFolders = async (req, res, next) => {
    console.log('wee')
    try {
        const folders = await Folders.find({});
        res.json({folders: folders});
    } catch(error) {

    }
}

// getfolders by user 
exports.getFoldersByUser = async (req, res, next) => {
    try {
        const folders = await Folders.find({author: req.params.idUser}).sort({created_at: -1});
        res.json({folders: folders});
    } catch(error) {

    }
}


// getfolder by id
exports.getFolderById = async (req, res, next) => {

        const folder = await Folders.findOne({_id: req.params.idFolder}).populate({
            path: 'files.file',
            model: 'Link'
        });;
      
        if (!folder) {
            res.status(404).json({message: 'Esta carpeta no existe'});
            return next();
        }
        res.json({folder: folder});
        next();
}

// 