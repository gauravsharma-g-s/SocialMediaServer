const mongoose = require('mongoose')

const postSchema = mongoose.Schema(
    {
        userId : {
            type: String,
            required: true
        },
        firstName : {
            type: String,
            required: true
        },
        lastName : {
            type: String,
            required: true
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath:String,
        likes: {
            type: Map,
            of: Boolean
        },
        comments: [{
            text:String,
            commentBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            picturePath:String,
            name:String
        }]
    },
    { timeStamps: true}
)

const Post = mongoose.model("Post",postSchema)

module.exports = Post;