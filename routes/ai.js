// routes/ai.js
const express = require("express");
const router = express.Router();

// Import centralized AI service
const { getAIResponse } = require("../lib/aiService");

/**
 * POST /api/ai/chat
 * Body: { message: string, topic?: string, difficulty?: string }
 * Returns: { reply: string, topic: string, difficulty: string }
 */
router.post("/chat", async (req, res) => {
  try {
    const { message, topic = "General", difficulty = "beginner" } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // Call AI service
    const reply = await getAIResponse(message, { topic, difficulty });

    res.json({
      reply,
      topic,
      difficulty,
      tokens_used: response.usage.total_tokens,
    });
    
  } catch (error) {
    console.error("AI Service Error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

module.exports = router;