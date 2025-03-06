import express from "express";
import {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
  getPlaylistsByArtist
} from "../controllers/playlistController.js";

const router = express.Router();

router.post("/create", createPlaylist);
router.get("/", getAllPlaylists);
router.get("/:id", getPlaylistById);
router.post("/add-song", addSongToPlaylist);
router.post("/remove-song", removeSongFromPlaylist);
router.delete("/:id", deletePlaylist);
router.get("/artist/:artistId", getPlaylistsByArtist);

export default router;
