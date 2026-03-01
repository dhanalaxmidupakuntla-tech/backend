const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const message = req.body?.message;
    const topic = req.body?.topic || "General";
    const difficulty = req.body?.difficulty || "beginner";

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemPrompt = `You are Lingoo, a friendly language tutor.
Topic: ${topic}
Difficulty: ${difficulty}
Give short, clear, encouraging answers.`;

    // ✅ NEW OpenAI API (CORRECT)
    const completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: completion.output_text,
    });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({
      error: "AI service failed",
      details: err.message,
    });
  }
});

module.exports = router;