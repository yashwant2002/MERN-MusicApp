import express from "express";
import {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
  getPlaylistsByArtist,
  getMyOwnPlaylists
} from "../controllers/playlist.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", authenticateUser, createPlaylist);
router.get("/", getAllPlaylists);
router.get("/my-playlists", authenticateUser, getMyOwnPlaylists);
router.get("/:id", getPlaylistById);
router.post("/add-song", authenticateUser, addSongToPlaylist);
router.delete("/:playlistId/songs/:songId", authenticateUser, removeSongFromPlaylist);
router.delete("/:id", authenticateUser, deletePlaylist);
router.get("/artist/:artistId", getPlaylistsByArtist);

export default router;
