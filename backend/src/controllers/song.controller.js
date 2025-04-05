import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";


//  Create a new song (with file upload)
export const createSong = async (req, res) => {
  try {
    if (!req.files || !req.files.track || !req.files.thumbnail) {
      return res.status(400).json({ message: "Track and thumbnail are required." });
    }

    const trackPath = req.files.track[0].path;
    const thumbnailPath = req.files.thumbnail[0].path;

    // Upload track to Cloudinary
    const trackUpload = await cloudinary.uploader.upload(trackPath, {
      resource_type: "video", // Allows audio duration metadata
      folder: "tracks"
    });

    // Upload thumbnail to Cloudinary
    const thumbnailUpload = await cloudinary.uploader.upload(thumbnailPath, {
      folder: "thumbnails"
    });

    // Ensure duration exists
    if (!trackUpload.duration) {
      return res.status(400).json({ message: "Failed to get track duration from Cloudinary." });
    }

    // Cleanup temporary files
    fs.unlinkSync(trackPath);
    fs.unlinkSync(thumbnailPath);

    const songData = {
      ...req.body,
      artist: req.userId,
      track: trackUpload.secure_url,
      thumbnail: thumbnailUpload.secure_url,
      duration: trackUpload.duration // Cloudinary returns duration in seconds
    };

    const song = new Song(songData);
    await song.save();

    res.status(201).json(song);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//  Get all songs
export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate("artist", "firstName lastName");
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSongByName = async (req, res) => {
  const { name } = req.params;

  try {
    const regex = new RegExp(name, "i"); // case-insensitive search
    const songs = await Song.find({ title: regex }).populate("artist");

    if (!songs.length) {
      return res.status(404).json({ message: "No songs found" });
    }

    res.status(200).json(songs);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


//  Get my own song
export const getMyOwnSongs = async (req, res) => {
  try {
    // console.log("getMyOwnSongs - req.userId:", req.userId);
    if (!req.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const songs = await Song.find({ artist: req.userId }).populate("artist", "firstName lastName");

    if (!songs.length) {
      return res.status(404).json({ message: "No songs found for this user" });
    }

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  Get song by ID
export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate("artist", "firstName lastName");
    if (!song) return res.status(404).json({ message: "Song not found" });

    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Update a song (Only owner can update)
export const updateSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    if (song.artist.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only update your own songs" });
    }

    const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(updatedSong);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🎵 Delete a song (Only owner can delete)
export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    if (song.artist.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own songs" });
    }

    await song.deleteOne();
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Like a song
export const likeSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    song.likes += 1;
    await song.save();
    res.status(200).json({ message: "Song liked", likes: song.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Play a song (Increase play count)
export const playSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    song.plays += 1;
    await song.save();
    res.status(200).json({ message: "Song played", plays: song.plays });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get song by artist name and title
export const getSongByArtistAndTitle = async (req, res) => {
  try {
    const { artistName, songTitle } = req.query;
    if (!artistName || !songTitle) {
      return res.status(400).json({ message: "Artist name and song title are required" });
    }

    const nameParts = artistName.split(" ");
    const firstNameQuery = nameParts[0];
    const lastNameQuery = nameParts[1] || "";

    const artist = await User.findOne({
      $or: [
        { firstName: { $regex: new RegExp(`^${firstNameQuery}`, "i") } },
        { lastName: { $regex: new RegExp(`^${lastNameQuery}`, "i") } }
      ]
    });

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const song = await Song.findOne({
      title: { $regex: new RegExp(`^${songTitle}`, "i") },
      artist: artist._id
    }).populate("artist");

    if (!song) {
      return res.status(404).json({ message: "Song not found for this artist" });
    }

    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
