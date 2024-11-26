var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/user');

router.get('/login', function (req, res) {
    res.render('login');  
});

router.get('/register', function (req, res) {
    res.render('register');  
});

router.post('/register', function (req, res) {
    
    var username = req.body.username;
    var password = req.body.password;

    

    var newUser = new User({ username: username, password: password });

    newUser.save()
        .then(function () {
            req.session.user = { id: newUser._id, username: newUser.username };
            res.redirect('/sendMessage');
        })
        .catch(function (err) {
            console.error('Registration error:', err);
            res.status(500).send('Registration error');
        });
});

router.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({ username: username })
        .then(function (user) {
            if (!user) {
                return res.status(401).send('Incorrect username or password');
            }

            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) {
                    console.error('Error comparing password:', err);
                    return res.status(500).send('Login error');
                }

                if (isMatch) {
                    req.session.user = { id: user._id, username: user.username };
                    return res.redirect('/sendMessage');
                } else {
                    return res.status(401).send('Incorrect username or password');
                }
            });
        })
        .catch(function (err) {
            console.error('Login error:', err);
            res.status(500).send('Login error');
        });
});

router.post('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.send('You have been logged out');
    });
});

module.exports = router;
