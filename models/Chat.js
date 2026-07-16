const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    subject: { type: String, required: true, minLength: 4 },
    body: { type: String, required: true, minLength: 20, maxLength: 500 },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    response: { type: String, minLength: 20, maxLength: 500 },
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat