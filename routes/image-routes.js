const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-middleware')
const {uploadImageController, fetchImageController,deleteImageController} = require('../controllers/imageControllers')

const router = express.Router();



//upload a image
router.post('/upload',
    authMiddleware,
    adminMiddleware,
    uploadMiddleware.single('image'),
    uploadImageController)

//get all the images
router.get('/get', authMiddleware, fetchImageController);

router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;