const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const cloudinary = require("cloudinary").v2;
require('dotenv').config();
/* CONFIGURING THE CLOUDINARY FOR IMAGE UPLOAD */
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
        folder: "profiles",
        resource_type: "auto",
    });
    return res;
}

/* REGISTER USER */
const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            friends,
            location,
            occupation
        } = req.body;                                               // Destructure the req.body object and extract all values

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);      // password encrption
        // image storing
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const response = await handleUpload(dataURI);
        const newUser = new User({                                 // New User Details
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath: response.public_id,
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
        console.log("Error: Cannot",err);
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