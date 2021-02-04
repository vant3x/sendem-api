const express = require('express');
const router = express.Router();
const filesController = require('./../controllers/filesController');
const auth = require('../middlewares/auth');

router.post('/files', 
    auth,
    filesController.uploadFile
);

router.get('/file/:file',
    filesController.downloadFile,
    filesController.deleteFile
);



module.exports = router; 