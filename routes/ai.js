const express = require('express');
const router = express.Router();
const openai = require('openai');

const client = new openai.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI Chat Endpoint
router.post('/chat', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return res.status(500).json({ error: 'OpenAI API key not configured on server' });
    }
    const { message, topic, difficulty, type } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create system prompt based on topic and difficulty
    const systemPrompt = `You are Lingoo AI, a friendly language tutor.
Topic: ${topic || 'General'}
Difficulty Level: ${difficulty || 'beginner'}
Type: ${type || 'tutor'}

Guidelines:
- For beginner: Use simple words and short sentences. Include English translations.
- For intermediate: Mix native language with English explanations.
- For advanced: Respond mostly in the target language.
- Keep responses concise (2-4 sentences).
- Include pronunciation tips when helpful.
- Be encouraging and supportive.`;

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;

    res.json({
      reply,
      topic,
      difficulty,
      tokens_used: response.usage.total_tokens,
    });
  } catch (error) {
    console.error('AI Error:', error);
    const errMsg = error?.message || 'Unknown error from AI service';
    // include any response details if present (helpful for remote debugging)
    if (error?.response) {
      console.error('AI response error details:', error.response);
    }
    res.status(500).json({
      error: 'Failed to get AI response',
      message: errMsg,
    });
  }
});

module.exports = router;