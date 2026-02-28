const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const streakController = require("../controllers/streakController");

router.post("/", auth, streakController.updateStreak);

module.exports = router;