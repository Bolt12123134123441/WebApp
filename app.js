var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var path = require('path');
var dotenv = require('dotenv');

var authRoutes = require('./routes/auth');
var messageRoutes = require('./routes/messages');

dotenv.config();

var app = express();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/student-chat')
    .then(function () {
        console.log('Connected MongoDB');
    })
    .catch(function (err) {
        console.error('ERROR MongoDB:', err);
    });

app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/', messageRoutes);

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Server start http://localhost:' + PORT);
});