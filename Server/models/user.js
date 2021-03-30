const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: 'https://res.cloudinary.com/arnabk/image/upload/v1597476572/22-223965_no-profile-picture-icon-circle-member-icon-png_d5qtoy.png'
    },
    resetToken:{
        type:String
    },
    expireToken:{
        type:Date
    },
    followers:[{type:mongoose.Schema.Types.ObjectId}],
    following:[{type:mongoose.Schema.Types.ObjectId}]
})

const User = mongoose.model('User', userSchema);

module.exports = User;