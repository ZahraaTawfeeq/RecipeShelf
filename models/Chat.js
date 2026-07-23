const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    message: String,
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
const chatSchema = mongoose.Schema({
    subject: { type: String, required: true, minLength: 4 },
    // body: { type: String, required: true, minLength: 20, maxLength: 500 },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    response: { type: String, minLength: 20, maxLength: 500 },
    messages:[messageSchema]
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat