const express = require('express')
const { getFeedPosts, getUserPosts, likePost, addComment ,deleteComment,deletePost} = require('../controllers/posts')
const { verifyToken } = require('../middleware/auth')

const router = express.Router()

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:postId/like", verifyToken, likePost);
router.put("/:postId/addComment",verifyToken,addComment);
router.delete("/:postId",verifyToken,deleteComment);
router.delete("/:postId/delete",verifyToken,deletePost);
module.exports = router;
