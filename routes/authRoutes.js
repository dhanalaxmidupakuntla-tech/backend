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

module.exports = router;