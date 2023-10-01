const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User')

/* REGISTER USER */
const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;                                               // Destructure the req.body object and extract all values

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);      // password encrption

        const newUser = new User({                                 // New User Details
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);            // Resource saved successfully and returned saved User to Front-End
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

/* LOGGING IN */
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user)
            return res.status(400).json({ msg: "User doesnot exists!" })
        const isMath = bcrypt.compare(password, user.password)
        if (!isMath) return res.status(400).json({ msg: "Please check you password!" })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)                   // creating access Token
        delete user.password;
        res.status(200).json({ token, user })                                              // Returned Token and Userdetails
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = {register,login};