import express from "express";
import { saveResult, getHistory, getLeaderboard } from "../controllers/testController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/result", authMiddleware, saveResult);
router.get("/history", authMiddleware, getHistory);
router.get("/leaderboard", getLeaderboard);

export default router;
