const express = require('express');
const router = express.Router();
const linksController = require('./../controllers/linksController');
const { check } = require('express-validator');
const auth = require('../middlewares/auth');

router.post('/links', 
    [
        check('fileName', 'Sube un archivo').not().isEmpty(),
        check('original_name' ,'Sube un archivo').not().isEmpty()
    ],
    auth,   
    linksController.newLink
);

router.get('/links',
    linksController.getLinks
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