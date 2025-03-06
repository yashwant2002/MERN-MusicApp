import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId, // Reference an Artist model
      ref: "Artist",
      required: true
    },
    lyrics: {
      type: String,
      default: "Lyrics not available"
    },
    track: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    genre: {
      type: [String],
      required: true,
      enum: ["Pop", "Rock", "Hip-Hop", "Classical", "Jazz", "EDM", "R&B", "Other"] 
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() 
    },
    likes: {
      type: Number,
      default: 0
    },
    plays: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);
