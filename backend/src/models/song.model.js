import mongoose from "mongoose"

const song = new mongoose.Schema({
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
    duration : {
        type : Number,
        required : true
    },
    year : {
        type : String,
        required : true
    }
},{timestamps:true});

export const Song = mongoose.model("Song", song);