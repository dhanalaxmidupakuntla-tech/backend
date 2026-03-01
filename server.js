require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const streakRoutes = require("./routes/streakRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const recommendRoutes = require("./routes/recommendRoutes");
const aiRoutes = require("./routes/ai");

const app = express();

/* ================= RATE LIMIT ================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

/* ================= CORS ================= */

app.use(cors());

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(helmet());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/reward", rewardRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/ai", aiRoutes);

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});