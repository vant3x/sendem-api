const express = require('express');
const router = express.Router();
const linksController = require('./../controllers/linksController');
const foldersController = require('./../controllers/foldersController');
const { check } = require('express-validator');
const auth = require('../middlewares/auth');

router.post('/links', 
    [
        check('fileName', 'Sube un archivo').not().isEmpty(),
        check('original_name' ,'Sube un archivo').not().isEmpty()
    ],
    auth,   
    linksController.newLink,
    foldersController.updateFilesFolder
);

router.get('/links',
    linksController.getLinks
);

router.get('/links/:idUser',
    linksController.getLinksByUser
);


router.get('/link/:url', 
    linksController.hasPassword,
    linksController.getLink
);

router.post('/link/:url', 
    linksController.verifyPassword,
    linksController.getLink
);

module.exports = router;