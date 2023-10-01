const Post = require('../model/Post')
const User = require('../model/User')

const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId)
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            picturePath,
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
        const posts = await Post.find()         // Gives all the posts
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
        const {userId} = req.body;
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

module.exports = { createPost, getFeedPosts, getUserPosts, likePost }