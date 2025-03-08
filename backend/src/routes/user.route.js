import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  likeSong,
  unlikeSong,
  subscribeArtist,
  unsubscribeArtist,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/profile", authenticateUser, getUserProfile);
router.put("/profile/update", authenticateUser, updateUserProfile);
router.post("/like-song", authenticateUser, likeSong);
router.post("/unlike-song", authenticateUser, unlikeSong);
router.post("/subscribe-artist", authenticateUser, subscribeArtist);
router.post("/unsubscribe-artist", authenticateUser, unsubscribeArtist);

export default router;
