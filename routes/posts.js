const express = require('express')
const { getFeedPosts, getUserPosts, likePost } = require('../controllers/posts')
const { verifyToken } = require('../middleware/auth')

const router = express.Router()

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts)

/* UPDATE */
router.patch("/:postId/like", verifyToken, likePost)

module.exports = router;
