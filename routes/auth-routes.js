const express = require('express');
const router = express.Router();
const { registerUser, loginUser, changePassword} = require('../controllers/auth-controllers');
const authMiddleware = require('../middleware/auth-middleware');

//All routes are related to authentication and authorization
router.post('/register', registerUser); // Route for user registration
router.post('/login', loginUser); // Route for user login
router.post('/change-password',authMiddleware ,changePassword)

module.exports = router;