// routes/ai.js
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiChat = async (req, res) => {
  try {
    const { message, topic = "General", difficulty = "beginner" } = req.body;

    const systemPrompt = `You are Lingoo, a friendly language tutor. 
Topic: ${topic}
Difficulty: ${difficulty}
Provide concise, encouraging responses.`;

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
      topic,
      difficulty,
      tokens_used: response.usage.total_tokens,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};