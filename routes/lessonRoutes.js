const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

// register
router.post("/register", authController.register);

// login
router.post("/login", authController.login);

// 👇 THIS WAS MISSING OR WRONG
router.get("/me", auth, authController.getMe);

// Current leaderboard
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("id,email,total_xp")
      .limit(50);

    if (error) return res.status(400).json(error);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;