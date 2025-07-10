const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');

router.get('/welcome', authMiddleware, (req, res) => {
    const {userId, username,email, role} = req.userInfo; // Extract user information from the request object
    res.status(200).json({
        user: {
            _id: userId,
            username:username,
            email,
            role
        },
        success: true,
        message: "Welcome to the home page"
    });
});

module.exports = router;