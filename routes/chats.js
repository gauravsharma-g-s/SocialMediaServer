const express = require("express");
const { createConversation, sendMessage, getConversations, getMessages, getConversation, updateLastMessage, markAsRead } = require('../controllers/chats');
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// CREATE CHATS AND CONVERSATION ID
router.post("/createConversation", verifyToken, createConversation);
router.post("/sendMessage", verifyToken, sendMessage)

// READ CHATS AND CONVERSATION ID
router.get("/getConversations/:userId", verifyToken, getConversations);
router.get("/getMessages/:conversationId", verifyToken, getMessages);

router.get("/getConversation/:user1/:user2", verifyToken, getConversation)

// Increment Msg Count and set LAst Message
router.post("/updateLastMessage/:conversationId/:senderId",verifyToken,updateLastMessage)

// Mark as Read
router.post("/markAsRead/:conversationId/:senderId",verifyToken,markAsRead)
module.exports = router;