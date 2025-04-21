import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getmatches,
  getUserprofiles,
  swipeLeft,
  swipeRight,
} from "../controllers/matchController.js";

const router = express.Router();

router.post("/swipe-right/:likedUserId", protectRoute, swipeRight);
router.post("/swipe-left/:dislikedUserId", protectRoute, swipeLeft);
router.get("/", protectRoute, getmatches);
router.get("/user-profiles", protectRoute, getUserprofiles);
export default router;
