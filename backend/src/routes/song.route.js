import express from "express";
import {
  createSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
  likeSong,
  playSong,
  getSongByArtistAndTitle
} from "../controllers/song.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, createSong);
router.get("/", getAllSongs);
router.get("/:id", getSongById);
router.put("/:id", authenticateUser, updateSong);
router.delete("/:id", authenticateUser, deleteSong); 
router.patch("/:id/like", authenticateUser, likeSong); 
router.patch("/:id/play", playSong);
router.get("/search", getSongByArtistAndTitle);

export default router;
