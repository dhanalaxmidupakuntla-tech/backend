const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { message, topic = "General", difficulty = "beginner" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemPrompt = `
You are Lingoo AI, a friendly language tutor.
Topic: ${topic}
Difficulty: ${difficulty}
Be concise, encouraging, and simple.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 150,
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI ROUTE ERROR:", error);
    res.status(500).json({
      error: "AI service failed",
      details: error.message,
    });
  }
});

module.exports = router;