const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        throw new Error('Error uploading to Cloudinary');
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== 'ok') {
            throw new Error('Error deleting from Cloudinary');
        }
    } catch (error) {
        throw new Error('Error deleting from Cloudinary');
    }
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary
};