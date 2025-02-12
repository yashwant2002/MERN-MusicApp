const mongoose = require("mongoose")

const playlist = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    thumbnail : {
        type : String,
        required : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    song : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Song"
    }],
    collaborates : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }]
},{timestamps: true});

const Playlist = mongoose.model("Playlist", playlist)

module.exports = Playlist;