const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    // ✅ Safe destructuring
    const message = req.body?.message;
    const topic = req.body?.topic || "General";
    const difficulty = req.body?.difficulty || "beginner";

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemPrompt = `You are Lingoo, a friendly language tutor.
Topic: ${topic}
Difficulty: ${difficulty}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 150,
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({
      error: "AI service failed",
      details: err.message,
    });
  }
});

module.exports = router;