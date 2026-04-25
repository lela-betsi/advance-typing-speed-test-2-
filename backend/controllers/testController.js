import TestResult from "../models/TestResult.js";

export const saveResult = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);
    const { wpm, accuracy, level } = req.body;

    const result = await TestResult.create({
      userId: req.user.id,
      wpm,
      accuracy,
      level,
    });

    res.json(result);
  } catch (error) {
    console.error("Error in saveResult:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getHistory = async (req, res) => {
  const results = await TestResult.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(results);
};

export const getLeaderboard = async (req, res) => {
  const leaderboard = await TestResult.find()
    .sort({ wpm: -1 })
    .limit(10)
    .populate("userId", "username");

  res.json(leaderboard);
};
