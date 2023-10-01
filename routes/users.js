const express = require('express')

const { getUser, getUserFriends, addRemoveFriend } = require('../controllers/users')
const { verifyToken } = require('../middleware/auth')

const router = express.Router()

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends)

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

module.exports = router;