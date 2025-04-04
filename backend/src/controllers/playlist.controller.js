import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

export const createPlaylist = async (req, res) => {
  try {

    const { name } = req.body;
    const owner = req.userId;

    if (!req.user || !owner) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!name) {
      return res.status(400).json({ message: "Playlist name is required" });
    }
    const existingPlaylist = await Playlist.findOne({ name, owner });
    if (existingPlaylist) {
      return res.status(400).json({ message: "You already have a playlist with this name" });
    }

    const newPlaylist = new Playlist({
      name,
      owner,
      thumbnail:  "https://yt3.googleusercontent.com/wotexgHbeJJzumPdT8hUvTKElOEC24FPKO0sUMuQShht4B85voTd0o7KnR9o83FGXWwraCpbCZxq=s1200",
      songs: [],
    });

    await newPlaylist.save();

    res.status(201).json({ message: "Playlist created successfully", playlist: newPlaylist });
  } catch (error) {
    console.error("Error Creating Playlist:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getMyOwnPlaylists = async (req, res) => {
  try {
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const playlists = await Playlist.find({ owner: userId })
      .populate("owner", "firstName lastName")
      .populate({
        path: "songs", 
        populate: { path: "artist", select: "firstName lastName" },
      });


    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ message: "No playlists found" });
    }

    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find()
      .populate("owner", "firstName lastName")
      .populate({
        path: "songs",
        populate: { path: "artist", select: "firstName lastName" },
      })
      .lean();

    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id)
      .populate("owner", "firstName lastName")
      .populate({
        path: "songs",
        populate: { path: "artist", select: "firstName lastName" },
      })
      .lean();

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found." });
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found." });

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Song not found." });

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params; 
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found." });

    playlist.songs = playlist.songs.filter((song) => song.toString() !== songId);
    await playlist.save();

    res.status(200).json({ message: "Song removed from playlist." });
  } catch (error) {
    console.error("Error removing song:", error);
    res.status(500).json({ message: error.message });
  }
};


export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.params);
    
    const playlist = await Playlist.findByIdAndDelete(id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found." });

    res.status(200).json({ message: "Playlist deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaylistsByArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    const songsByArtist = await Song.find({ artist: artistId }).select("_id");

    if (songsByArtist.length === 0) {
      return res.status(404).json({ message: "No songs found for this artist." });
    }

    const songIds = songsByArtist.map((song) => song._id);
    const playlists = await Playlist.find({ songs: { $in: songIds } })
      .populate("owner", "firstName lastName")
      .populate({
        path: "songs",
        populate: { path: "artist", select: "firstName lastName" },
      })
      .lean();

    if (playlists.length === 0) {
      return res.status(404).json({ message: "No playlists found containing songs by this artist." });
    }

    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};