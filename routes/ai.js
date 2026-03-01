const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================
   1️⃣ AI CHAT (Text Tutor)
========================= */
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
      model: "llama-3.1-8b-instant",
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
    console.error("Groq chat error:", err);
    res.status(500).json({
      error: "AI service failed",
      details: err.message,
    });
  }
});


router.post("/lesson-quiz", async (req, res) => {
  try {
    const { language, words, level } = req.body;

    const prompt = `
You are a language tutor.
Create 3 MCQ questions for ${language}.
Level: ${level}

Words: ${words.join(", ")}

Format JSON ONLY:
[
  {
    "question": "",
    "options": ["", "", ""],
    "answer": ""
  }
]
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) {
    res.status(500).json({ error: "AI quiz failed" });
  }
});

/* =========================
   2️⃣ AI SPEAKING EVALUATION
========================= */
router.post("/evaluate-speech", async (req, res) => {
  try {
    const { target, spoken, language = "English" } = req.body;

    if (!target || !spoken) {
      return res.status(400).json({ error: "Target and spoken text required" });
    }

    const prompt = `
You are a language pronunciation evaluator.

Language: ${language}

Correct sentence:
"${target}"

User said:
"${spoken}"

Evaluate:
1. Is it correct? (true/false)
2. Give a score from 0 to 10
3. Give simple feedback (easy English)

Respond ONLY in JSON:
{
  "correct": true/false,
  "score": number,
  "feedback": "text"
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 120,
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);
  } catch (err) {
    console.error("Groq speaking error:", err);
    res.status(500).json({
      error: "AI speaking evaluation failed",
      details: err.message,
    });
  }
});

module.exports = router;