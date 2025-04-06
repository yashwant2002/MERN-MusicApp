import { User } from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("likedSongs", "title artist")
      .populate("playlist", "name")
      .populate("subscribeArtist", "name");

    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ message: "Profile updated successfully!", updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likeSong = async (req, res) => {
  try {
    const { songId } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.likedSongs.includes(songId)) {
      user.likedSongs.push(songId);
      await user.save();
    }

    res.status(200).json({ message: "Song added to liked songs!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Remove a song from likedSongs
export const unlikeSong = async (req, res) => {
  try {
    const { songId } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.likedSongs = user.likedSongs.filter((id) => id.toString() !== songId);
    await user.save();

    res.status(200).json({ message: "Song removed from liked songs!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const 
getLikedSongs = async (req, res) => {
  try {
    // console.log("Fetching liked songs for user:", req.userId);
    const user = await User.findById(req.userId).populate({
      path: 'likedSongs',
      populate: {
        path: 'artist',
        select: 'firstName lastName'
      }
    });

    if (!user) return res.status(404).json({ message: "User not found." });
    // console.log("Liked songs:", user.likedSongs);


    res.status(200).json(user.likedSongs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const subscribeArtist = async (req, res) => {
  try {
    const { artistId } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.subscribeArtist.includes(artistId)) {
      user.subscribeArtist.push(artistId);
      await user.save();
    }

    res.status(200).json({ message: "Subscribed to artist!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const unsubscribeArtist = async (req, res) => {
  try {
    const { artistId } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.subscribeArtist = user.subscribeArtist.filter((id) => id.toString() !== artistId);
    await user.save();

    res.status(200).json({ message: "Unsubscribed from artist." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
