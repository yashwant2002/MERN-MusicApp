const mongoose = require("mongoose")

const user = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password : {
        type : String,
        required : true
    },
    likedSongs : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Songs"
    }],
    playlist : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Playlist"
    }],
    subscribeArtist : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : "Artist"
    }]
},{timestamps: true})

const User = mongoose.model('User', user);

module.exports = User;