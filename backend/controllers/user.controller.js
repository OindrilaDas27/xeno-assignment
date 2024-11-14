const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createUser = async(req, res) => {
    try {
        const userData = req.body;

        let checkUser = await User.findOne({ email: userData.email });
        if(checkUser!==null) {
            return res.status(400).json({message: "User already Exists", checkUser});
        }

        const newUser = await User.create({
            email: userData.email
        });
        const user = newUser.save();
        res.status(200).json({message: "New User is created!", user});
    } catch (error) {
        console.log('Error in creating user: ', error);
        return res.status(400).json(error);
    }
}

const googleLogin = async(req, res) => {
    try {
        const {idToken} = req.body;
        const response = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { email_verified, email, name } = response.payload;
        if(!email_verified) {
            return res.status(400).json({error: "Google login failed"});
        }
        let user = await User.findOne({ email });
        if(user) {
            const token = jwt.sign({
                _id: user._id,
            },                 
            process.env.JWT_SECRET, {
                expiresIn: "1h",
            })
            res.status(200).json({token, user})
        } else {
            user = new User({ email, name });
            const newUser = await user.save();

            const token = jwt.sign({
                _id: newUser._id
            }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            })
            res.status(200).json({ token, user });
        }
    } catch (error) {
        console.log("Error in Google Login: ", error);
        return res.status(400).json({ error: "Google login failed. Please try again." });
    }
}

module.exports = { createUser, googleLogin };