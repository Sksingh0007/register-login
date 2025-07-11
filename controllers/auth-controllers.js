const User = require('../models/user'); // Import the User model
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config();


//register controller
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body; // Destructure the request body to get user details
        // Check if the user already exists
        const checkExistingUser = await User.findOne({ $or: [{ username }, { email }] })
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this username or email already exists"
            })
        }
        //hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //create newly created user and save in your database
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedPassword,
            role : role || user
        })
        await newlyCreatedUser.save();
        if (newlyCreatedUser) {
            res.status(201).json({
                success : true,
                message: "User registered successfully"
            })
        }
        else {
            res.status(400).json({
              success: false,
              message: "User not registered , Please try again",
            });
        }

    }
    catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Internal server error" });

    }
}

//login controller
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        //first find if the current user exists in Db or not
        const currentUser = await User.findOne({ username })
        
        if (!currentUser) {
            return res.status(400).json({
                success: false,
                message : "Invalid Credentials!, User doesnt exists"
            })
        }
        //if the password is correct or not 
        const isPasswordMatch = await bcrypt.compare(password, currentUser.password)
        if (!isPasswordMatch) {
            return res.status(400).json({
              success: false,
              message: "Invalid Credentials!, Wrong password",
            }); 
        }

        //create user token
        const token = jwt.sign({
            userId: currentUser._id,
            username: currentUser.username,
            email: currentUser.email,
            role: currentUser.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '30m' //Token will expire in 30 min
        })
        res.status(200).json({
            success: true,
            message: "Logging successfull",
            token
        })
    }
    catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.userId;
        console.log("userId from token:", req.userInfo?.userId);


        //extract old and new password
        const { oldPassword, newPassword } = req.body;

        //find the current logged in user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        //check if the old password is correct
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is not correct , Please try again"
            })
        }
        // hash the pass
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        //update the user password
        user.password = newHashedPassword
        await user.save();
        
        res.status(200).json({
            success: true,
            message: "New password updated successfully"
        })

    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    registerUser,
    loginUser,
    changePassword
};