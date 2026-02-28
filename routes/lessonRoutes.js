const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const lessonController = require("../controllers/lessonController");

router.get("/", auth, lessonController.getLessons);
router.post("/complete", auth, lessonController.completeLesson);

module.exports = router;