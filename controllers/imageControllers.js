
const Image = require('../models/imageModel');
const {uploadToCloudinary} = require('../helper/cloudinaryHelper');

const uploadImage = async (req, res) => {
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
        res.status(201).json({ message: 'Image uploaded successfully', image });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error });
    }
};

module.exports = {
    uploadImage
};