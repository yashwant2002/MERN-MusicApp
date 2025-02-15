import mongoose from "mongoose";

const playlist = new mongoose.Schema({
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

export const Playlist = mongoose.model("Playlist", playlist)