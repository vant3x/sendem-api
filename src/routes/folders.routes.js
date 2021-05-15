const express = require('express');
const router = express.Router();
const foldersController = require('../controllers/foldersController');
const { check } = require('express-validator');
const auth = require('../middlewares/auth');

router.post('/folders', 
    [
        check('folderName', 'La carpeta debe tener un nombre').isLength({min:3}),
    ],
    auth,   
   foldersController.newFolder
);

router.get('/folders',
    foldersController.getFolders
);

router.get('/folders/:idUser',
    foldersController.getFoldersByUser
);

router.get('/folder/:idFolder',
    foldersController.getFolderById
);


module.exports = router;