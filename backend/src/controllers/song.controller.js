import { Song } from "../models/song.model.js";

// Create a new song
export const createSong = async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  Get all songs 
export const getAllSongs = async (req, res) => {
  try {
    const { genre, artist, search } = req.query;
    let filter = {};

    if (genre) filter.genre = genre;
    if (artist) filter.artist = artist;
    if (search)
      filter.title = { $regex: search, $options: "i" };

    const songs = await Song.find(filter).populate("artist");
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate("artist");
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSong = async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedSong) return res.status(404).json({ message: "Song not found" });
    res.status(200).json(updatedSong);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);
    if (!deletedSong) return res.status(404).json({ message: "Song not found" });
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const getSongByArtistAndTitle = async (req, res) => {
  try {
    const { artistName, songTitle } = req.query;
    
    if (!artistName || !songTitle) {
      return res.status(400).json({ message: "Artist name and song title are required" });
    }

    const song = await Song.findOne({ 
      title: { $regex: new RegExp(songTitle, "i") }
    }).populate({
      path: "artist",
      match: { name: { $regex: new RegExp(artistName, "i") } }
    });

    if (!song || !song.artist) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

