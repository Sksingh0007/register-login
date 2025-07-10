const express = require('express');
const router = express.Router();
const { registerUser, loginUser} = require('../controllers/auth-controllers');

//All routes are related to authentication and authorization
router.post('/register', registerUser); // Route for user registration
router.post('/login', loginUser); // Route for user login

module.exports = router;