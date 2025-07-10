const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const dotenv = require('dotenv').config(); // Load environment variables from .env file

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization; // Get the authorization header from the request
    const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the header

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied, No token provided"
        });
    }
    try {
        // verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // Attach user information to the request object
        req.userInfo = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role
        };
        next();

    }catch (error) {
        console.error("Error in authMiddleware:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


module.exports = authMiddleware;