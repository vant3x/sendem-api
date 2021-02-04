const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middlewares/auth');

router.post('/auth', 
    [
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password no puede ir vacio').not().isEmpty()
    ],  
    authController.userAuthentication
);

router.get('/auth', 
    auth,
    authController.userAuthenticate
);

module.exports = router;