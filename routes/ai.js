const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are a fun language tutor for children.
            Use emojis.
            Give examples in Spanish, French, and German.
            Keep explanations short.
            Encourage the student.
          `,
        },
        { role: "user", content: message },
      ],
      max_tokens: 200,
    });

    const reply = completion.choices?.[0]?.message?.content || "No reply generated";
    res.json({ reply });

  } catch (error) {
    console.error("OpenAI error:", error.response?.data || error.message || error);
    res.status(500).json({ error: "AI failed", details: error.message });
  }
});

module.exports = router;