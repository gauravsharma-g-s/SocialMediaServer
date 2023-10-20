const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
    {
        chatters:{
            type:Array,
            default:[]
        },
        sender:{
            type:String
        },
        lastMessage:{
            type:String,
            default:""
        },
        isRead:{
            type:Boolean
        },
        count:{
            type:Number,
            default:0
        },
        sentTime:{
            type:Date
        }

    },
    {
        timestamps:true
    }
);

const Conversation = mongoose.model("Conversation",ConversationSchema);
module.exports=Conversation;