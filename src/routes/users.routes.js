const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const { check } = require('express-validator');

router.post('/users',
    [
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe ser al menos de 6 caracteres').isLength({min:6})
    ],
    userController.newUser
);

router.get('/user/:id',
    userController.getUser
);


module.exports = router;