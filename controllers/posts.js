const Post = require('../model/Post')
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
        folder: "posts",
        resource_type: "auto",
    });
    return res;
}
const createPost = async (req, res) => {
    try {
        const { userId, description } = req.body;
        const user = await User.findById(userId)
        // Storing the image in cloudinary

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const response = await handleUpload(dataURI);

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            picturePath: response.public_id,
            userPicturePath: user.picturePath,
            likes: {},
            comments: []
        })
        await newPost.save()
        const posts = await Post.find()         // Gives all the posts
        res.status(201).json(posts)
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}


/* READ */
const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();        // Gives all the posts
        res.status(200).json(posts)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}


const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const userPosts = await Post.find({ userId })
        res.status(200).json(userPosts)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/* UPDATE */
const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(postId);
        const isLiked = post.likes.get(userId);                 // If post liked or not
        if (isLiked)
            post.likes.delete(userId);
        else
            post.likes.set(userId, true);
        const updatedPost = await Post.findByIdAndUpdate(
            postId,                                             // Find post by its id
            { likes: post.likes },                              // Update likes
            { new: true }                                       // tells MongoDB to return the modified document
        )
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}


const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, text, picturePath, name } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: { text, commentBy: userId, picturePath, name } } },
            { new: true }
        )
        if (!updatedPost) {
            return res.status(404).json({ message: "Post doesn't exists" });
        }
        // Send the updatedPost to the frontend
        res.status(200).json(updatedPost);

    } catch (err) {
        res.json({ message: err.message })
    }
}


const deleteComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { commentId } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        )
        if (!updatedPost) {
            return res.status(404).json({ message: "Post doesn't exists" });
        }
        // Send the updatedPost to the frontend
        res.status(200).json(updatedPost);
    }
    catch (err) {
        res.json({ message: err.message })
    }
}

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const {picturePath} =  req.body;
        await cloudinary.uploader
            .destroy(picturePath)
            .then(result => console.log(result));
       await Post.findByIdAndRemove(postId);
       
        res.status(200).json("Deleted Successfully");
    }
    catch (err) {
        res.json({ message: err.message })
    }
}
module.exports = { createPost, getFeedPosts, getUserPosts, likePost, addComment, deleteComment, deletePost }