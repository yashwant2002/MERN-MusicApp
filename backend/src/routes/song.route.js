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
} from "../controllers/songController.js";

const router = express.Router();

router.post("/", createSong);
router.get("/", getAllSongs);
router.get("/:id", getSongById);
router.put("/:id", updateSong);
router.delete("/:id", deleteSong);
router.patch("/:id/like", likeSong);
router.patch("/:id/play", playSong);
router.get("/search", getSongByArtistAndTitle); {/* /api/songs/search?artistName=Drake&songTitle=God's Plan */}


export default router;
