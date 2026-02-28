const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const flashcardController = require("../controllers/flashcardController");

router.get("/", auth, flashcardController.getFlashcards);
router.post("/answer", auth, flashcardController.submitAnswer);

module.exports = router;