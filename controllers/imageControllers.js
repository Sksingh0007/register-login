const fs = require('fs')
const Image = require('../models/image');
const {uploadToCloudinary, deleteFromCloudinary} = require('../helper/cloudinaryHelper');

const uploadImageController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Upload the image to Cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path);
        // Create a new image document in the database
        const image = new Image({
            url,
            publicId,    // Assuming filename is used as publicId
            uploadedBy: req.userInfo.userId  // Assuming user info is available in req.userInfo
        });
        await image.save();
        //delte the file locally once uploaded
        fs.unlinkSync(req.file.path);


        res.status(201).json({ message: 'Image uploaded successfully', image });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error });
    }
};

const fetchImageController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);
        

        if (images) {
            res.status(200).json({
                success: true,
                data: images,
            })
        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong" , error
        })
    }
}

const deleteImageController = async (req, res) => {
    try {
        const getImageIdToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;

        //find the image by id
        const image = await Image.findById(getImageIdToBeDeleted);
        if (!image) {
            res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }
        //check if the image belongs to the user
        if (image.uploadedBy.toString() != userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this image"
            });
        }
        //delete the image from cloudinary
        const cloudinaryResponse = await deleteFromCloudinary(image.publicId);
        //delete the image from database
        await Image.findByIdAndDelete(getImageIdToBeDeleted);
        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong" + error.message
        })
    }
}

module.exports = {
    uploadImageController,
    fetchImageController,
    deleteImageController
};