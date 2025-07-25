const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim : true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);