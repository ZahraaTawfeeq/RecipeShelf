const router = require("express").Router()
const isSignedIn = require('../middleware/is-signed-in')
const Chat = require('../models/chat.js')
const User = require('../models/user.js')
const Recipe = require('../models/Recipe.js')

router.get('/chat-window/:id', isSignedIn, async (req, res) => {
    const recipient = await User.findById(req.params.id)

    res.render('chat/chat.ejs', { recipient })
})

router.post('/new', isSignedIn, async (req, res) => {

    const newChat = {
        subject: req.body.subject,
        recipient: req.body.recipient,
        sender: req.session.user._id,
        messages: [{ sender: req.session.user._id, message: req.body.body }]
    }
    Chat.create(newChat)
    res.redirect(`/chats/chat-history`)
})

router.get('/chat-history', isSignedIn, async (req, res) => {
    const chatsHistory = await Chat.find({ sender: req.session.user._id }).populate('recipient sender')
    const chatssHistory = await Chat.find({ recipient: req.session.user._id }).populate('recipient sender')


    res.render('chat/chat-history.ejs', { chatsHistory , chatssHistory})
})

router.get('/continue/:id', isSignedIn, async (req, res) => {
    const sendChat = await Chat.findById(req.params.id).populate('recipient sender messages.sender')
    res.render('chat/continue-chat.ejs', { sendChat })
})

router.post('/new-message', isSignedIn, async (req, res) => {
    const chatId = req.body.sender
    const chatContinue = await Chat.findById(chatId)

    const newMessage = {
        sender: req.session.user._id,
        message: req.body.message
    }
    chatContinue.messages.push(newMessage)
    chatContinue.save()
    res.redirect(`/chats/continue/${chatId}`)
})

module.exports = router;
