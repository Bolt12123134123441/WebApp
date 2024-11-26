'use strict';

var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Message', messageSchema);
