const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var userSchema = new Schema ({
    name: {
        type: String,
        required: true,
        min:10,
        max: 255
    },
    email : {
        type: String,
        required: true,
        min:10,
        max:255
    },
    password: {
        type: String,
        required: true,
        min:6,
        max:1024        
    },
    date: {
        type: Date,
        default: Date.now
    }


})

var user = new mongoose.model('User', userSchema)
module.exports = user;

