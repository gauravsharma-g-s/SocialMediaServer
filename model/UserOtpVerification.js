const mongoose = require('mongoose');

const UserOTPVerificationSchema = new mongoose.Schema({
    email:String,
    otp:String,
    createAt: Date,
    expirtedAt:Date
});

const UserOTPVerification = mongoose.model("UserOTPVerification",UserOTPVerificationSchema);
module.exports =  UserOTPVerification;