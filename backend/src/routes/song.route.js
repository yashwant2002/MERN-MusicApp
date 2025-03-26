import express from "express";
import {
  createSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
  likeSong,
  playSong,
  getSongByArtistAndTitle,
} from "../controllers/song.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/search", getSongByArtistAndTitle);
router.post(
  "/",
  authenticateUser,
  upload.fields([
    { name: "track", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createSong
);
router.get("/", getAllSongs);
router.get("/:id", getSongById);
router.put("/:id", authenticateUser, updateSong);
router.delete("/:id", authenticateUser, deleteSong);
router.post("/:id/like", authenticateUser, likeSong);
router.post("/:id/play", playSong);

export default router;
