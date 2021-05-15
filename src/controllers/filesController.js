const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Links = require('../models/Link');

exports.uploadFile = async (req, res, next) => {
    console.log(req.user);
    const adminLimitSize = req.user && req.user.role > 0 ? 2000000000 : 20000000;
    const multerConfig = {
        limits: { fileSize : req.user ? adminLimitSize :  4000000 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../../uploads')
            },
            filename: (req, file, cb) => {
                //const extension = file.mimetype.split('/')[1];
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            },
        })
    }

    const upload = multer(multerConfig).single('file');

    upload( req, res,  async (error) => {
        console.log(req.file);
        if (!error) {
            res.json({file: req.file.filename });
        } else {
            console.log(error);
            return next();
        }

    });
} 

exports.deleteFile = async (req, res, next) => {
    //console.log(req.file);
    try {
        fs.unlinkSync(__dirname +  `/../../uploads/${req.file}`);
    } catch (error) {
        console.log(error)
    }

}


// Descarga un archivos
exports.downloadFile = async (req, res, next ) => {

    // obtiene el link
    const link =  await Links.findOne({ fileName: req.params.file });
    
   const file = __dirname + '/../../uploads/' + req.params.file;
   res.download(file);

    // eliminar el archivo y la entrada de la base de datos
    // si las descargas son iguales a 1 - borrar la entrada y borrar el archivo
    
    const { downloadLimit, fileName } = link;
    if (downloadLimit === 1) {
        // eliminar el archivo
        req.file = fileName;

        await Links.findOneAndRemove({url: link.url});
        console.log(link);
        next();
        
    } else {
        link.downloadLimit--;
        await link.save();
    }

    // si las descargas son > a 1 - restar 1
}