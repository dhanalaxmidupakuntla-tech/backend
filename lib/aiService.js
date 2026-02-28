// lib/aiService.js
// Centralized AI service wrapper for the backend.  You can change the
// underlying package here without touching the route/controller code.
// Supported providers: "openai" (default), "hf" (HuggingFace Inference).
// Control the provider via the AI_PROVIDER environment variable.

const provider = process.env.AI_PROVIDER || "openai";

let openaiClient;
let hfClient;

async function initClients() {
  if (provider === "openai") {
    // OpenAI official package (installed via npm already)
    const { OpenAI } = require("openai");
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } else if (provider === "hf") {
    // HuggingFace inference client
    const { HfInference } = require("@huggingface/inference");
    hfClient = new HfInference({
      apiKey: process.env.HF_API_KEY,
    });
  }
}

// initialize on module load so callers don't have to worry about it
initClients();

/**
 * Ask the configured AI provider for a response.
 * @param {string} prompt   - user prompt or context string
 * @param {object} opts     - optional metadata (topic, difficulty, etc.)
 * @returns {Promise<string>} AI reply text
 */
async function getAIResponse(prompt, opts = {}) {
  if (provider === "openai") {
    const system = `You are Lingoo AI, a friendly language tutor. Topic: ${
      opts.topic || "General"
    }; Difficulty: ${opts.difficulty || "beginner"}`;
    const resp = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    });
    return resp.choices[0].message.content;
  } else if (provider === "hf") {
    // example using text-generation endpoint (GPT-2 by default)
    const result = await hfClient.textGeneration({
      model: "gpt2",
      inputs: prompt,
      max_new_tokens: 150,
    });
    // HuggingFace returns array of outputs
    return result[0]?.generated_text || "";
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

module.exports = { getAIResponse };
