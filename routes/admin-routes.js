const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware'); // Import the isAdminUser middleware
const router = express.Router();

router.get('/welcome', authMiddleware, adminMiddleware, (req, res) => {
    const { userId, username, role } = req.userInfo; // Extract user information from the request object
    res.status(200).json({
        user: {
            userId,
            username,
            role
        },
        success: true,
        message: "Welcome to the ADMIN home page"
    });
});


module.exports = router;