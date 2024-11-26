var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var User = require('../models/user');

router.get('/sendMessage', function (req, res) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    res.render('sendMessage');
});

router.post('/sendMessage', function (req, res) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    var messageText = req.body.message; 
    var senderId = req.session.user.id; 

    var newMessage = new Message({
        sender: senderId,
        message: messageText
    });

    newMessage.save()
        .then(function () {
            res.redirect('/allMessages');
        })
        .catch(function (err) {
            res.status(500).send('Something wrong');
        });
});

router.get('/allMessages', function (req, res) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    Message.find()
        .populate('sender', 'username')
        .sort({ date: -1 })
        .then(messages => {
            res.render('allMessages', { messages });
        })
        .catch(err => {
            res.status(500).send('Something wrong');
        });
});

module.exports = router;