const Conversation = require('../model/Conversation');
const Message = require('../model/Message');
const { ObjectId } = require('mongodb');

// CREATING CONVERSATION BETWEEN TWO USERS
const createConversation = async (req, res) => {
    const { senderId, receiverId } = req.body;
    const newConversation = new Conversation({
        chatters: [senderId, receiverId],
        sender:senderId
    })
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

// MESSAGE SEND
const sendMessage = async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

// GET CONVERSATIONS
const getConversations = async (req, res) => {
    const { userId } = req.params;
    try {
        let conversations = await Conversation.find({
            chatters: { $in: [userId] }
        });
        if(conversations){
            conversations = conversations.sort((a,b)=> b.updatedAt-a.updatedAt);
        }
        res.status(200).json(conversations);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

// GET MESSAGES
const getMessages = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const messages = await Message.find({
            conversationId
        })
        res.status(200).json(messages);
    }
    catch (err) {
        res.status(500).json(err);
    }
}


const getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            chatters: { $all: [req.params.user1, req.params.user2] }
        });
        if (conversation) res.status(200).json(conversation)
        else res.status(404).json(conversation)
    }
    catch (err) {
        res.status(500).json(err);
    }
}


const updateLastMessage = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const senderId = req.params.senderId;
        const { message } = req.body;
        const response = await Conversation.findByIdAndUpdate(
            conversationId,
            {
                $inc: { count: 1 },
                $set: {
                    lastMessage: message,
                    sender: senderId,
                    isRead: false,
                    sentTime: new Date().toISOString()
                }
            },
            { new: true })
        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json(err);
    }
}


const markAsRead = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const senderId = req.params.senderId;
        const response = await Conversation.findOneAndUpdate({
            _id: new ObjectId(conversationId),
            sender: senderId
        }, {
            $set: {
                count: 0,
                isRead: true
            }
        }, { new: true })
        res.status(200).json(response);

    }
    catch (err) {
        res.status(500).json(err);
    }
}

module.exports = { createConversation, sendMessage, getConversations, getMessages, getConversation, updateLastMessage, markAsRead };