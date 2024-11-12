const User = require('../models/user.model');

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

module.exports = { createUser };