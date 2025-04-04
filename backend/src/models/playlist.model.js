import mongoose from "mongoose";

const playlist = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    thumbnail : {
        type : String,
        default:  "https://yt3.googleusercontent.com/wotexgHbeJJzumPdT8hUvTKElOEC24FPKO0sUMuQShht4B85voTd0o7KnR9o83FGXWwraCpbCZxq=s1200",
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    songs : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Song"
    }],
    collaborates : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }]
},{timestamps: true});

export const Playlist = mongoose.model("Playlist", playlist)