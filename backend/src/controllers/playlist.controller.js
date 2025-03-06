import { Playlist } from "../models/Playlist.js";
import { Song } from "../models/Song.js";
import { User } from "../models/User.js";
t
export const createPlaylist = async (req, res) => {
  try {
    const { name, thumbnail, owner } = req.body;

    if (!name || !thumbnail || !owner) {
      return res.status(400).json({ message: "Name, thumbnail, and owner are required." });
    }

    const newPlaylist = new Playlist({ name, thumbnail, owner });
    await newPlaylist.save();

    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate("owner", "firstName lastName").populate("song", "title artist");
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
        path: "song",
        populate: { path: "artist", select: "name" },
      });

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

    if (!playlist.song.includes(songId)) {
      playlist.song.push(songId);
      await playlist.save();
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found." });

    playlist.song = playlist.song.filter((song) => song.toString() !== songId);
    await playlist.save();

    res.status(200).json({ message: "Song removed from playlist." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

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
    const playlists = await Playlist.find({ song: { $in: songIds } })
      .populate("owner", "firstName lastName")
      .populate({
        path: "song",
        populate: { path: "artist", select: "name" },
      });

    if (playlists.length === 0) {
      return res.status(404).json({ message: "No playlists found containing songs by this artist." });
    }

    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

