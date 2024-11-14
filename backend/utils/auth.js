const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

dotenv.config();

const secret_key = process.env.JWT_SECRET;

let findUserInDb = async(id) => {
    try {
        const user = await User.findById(id);
        return user.toObject();
    } catch (error) {
        console.log(error);
        return error;
    }
}

const decodeToken = (token) => {
    try {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret_key, (err, decodeData) => {
                if (err) 
                    reject(err)
                else
                    resolve(decodeData);
            })
        })
    } catch (error) {
        console.log(error);
        return error
    }
}

const authenticateJwt = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
                
        console.log("Token: ", token);

        if(!token) throw new Error("Token does not exist");

        const decodeData = await decodeToken(token);
        console.log("Decoded Data: ", decodeData);

        const userId = decodeData._id;
        const user = await findUserInDb(userId);

        if(!user) throw new Error("User not found");

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in authenticate Jwt: ", error);
        res.status(400).send(`Authentication failed: ${error.message}`);
    }
}

module.exports = { authenticateJwt };