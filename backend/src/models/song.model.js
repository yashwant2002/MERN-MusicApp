const mongoose = require("mongoose")

const song = mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    artist : {
        type : String,
        required : true
    },
    lyrics : {
        type : String
    },
    track : {
        type : String,
        required : true
    },
    thumbnail : {
        type : String,
        required : true
    },
    year : {
        type : String,
        required : true
    }
},{timestamps:true});

const Song = mongoose.model("Song", song);

module.exports = Song