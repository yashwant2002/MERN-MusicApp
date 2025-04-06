import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  likeSong,
  unlikeSong,
  subscribeArtist,
  unsubscribeArtist,
  getLikedSongs,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/profile", authenticateUser, getUserProfile);
router.put("/profile/update", authenticateUser, updateUserProfile);
router.post("/like", authenticateUser, likeSong);
router.post("/unlike", authenticateUser, unlikeSong);
router.get('/liked', authenticateUser, getLikedSongs);
router.post("/subscribe-artist", authenticateUser, subscribeArtist);
router.post("/unsubscribe-artist", authenticateUser, unsubscribeArtist);

export default router;
