const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const router = express.Router();


//upload a image
router.post('/upload',authMiddleware,adminMiddleware,);

//get all the images
router.get('/', imageController.getAllImages);

module.exports = router;