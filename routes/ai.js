const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { message, topic = "General", difficulty = "beginner" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemPrompt = `
You are Lingoo, a friendly language tutor.
Topic: ${topic}
Difficulty: ${difficulty}
Respond simply and clearly.
`;

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 150,
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("Groq AI error:", err);
    res.status(500).json({
      error: "AI service failed",
      details: err.message,
    });
  }
});

module.exports = router;