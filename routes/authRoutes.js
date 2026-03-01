const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const verifyToken = require("../middleware/verityToken")

// register
router.post("/register", authController.register);

// login
router.post("/login", authController.login);

router.get("/profile", verifyToken, authController.getProfile)

// 👇 THIS WAS MISSING OR WRONG
router.get("/me", auth, authController.getMe);

router.put("/profile/xp", authController.updateXp)

module.exports = router;