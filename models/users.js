let mongoose = require('mongoose');

//Article Schema

let users = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        requird: true
    },
    username: {
        type: String,
        requird: true
    },
    name:{
        type: String,
        requird: true
    }
});

let user = mongoose.model('users', users);

module.exports = user;

