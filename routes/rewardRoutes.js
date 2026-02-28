const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const rewardController = require("../controllers/rewardController");

router.post("/", auth, rewardController.dailyReward);

module.exports = router;