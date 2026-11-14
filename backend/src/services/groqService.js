/**
 * groqService.js
 * Shared Groq API integration for all AI features.
 * Uses axios (already a project dependency) to call the Groq REST API.
 */

const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

/**
 * Call the Groq LLM with a messages array.
 * @param {Array<{role:string, content:string}>} messages
 * @param {number} maxTokens
 * @param {string} apiKey - the specific GROQ API key for this project
 * @returns {Promise<string>} raw text content from the model
 */
async function callGroq(messages, maxTokens = 1500, apiKey) {
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error('No Groq API key provided. Set the appropriate GROQ_API_KEY_* in your .env file.');
  }

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return response.data.choices[0]?.message?.content || '';
  } catch (err) {
    const status = err.response?.status;
    if (status === 401) {
      throw new Error('Invalid or expired Groq API key. Please update your .env file with a valid key from console.groq.com');
    }
    if (status === 429) {
      throw new Error('Groq API rate limit reached. Please wait a moment and try again.');
    }
    throw err;
  }
}

/**
 * Safely parse JSON from an AI response.
 * Handles markdown code fences and leading/trailing text.
 * @param {string} text
 * @returns {object|null}
 */
function safeParseJSON(text) {
  try {
    const cleaned = text
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .trim();

    const start = cleaned.indexOf('{') !== -1 ? cleaned.indexOf('{') : cleaned.indexOf('[');
    const end =
      cleaned.lastIndexOf('}') !== -1 ? cleaned.lastIndexOf('}') : cleaned.lastIndexOf(']');

    if (start === -1 || end === -1) throw new Error('No JSON found in response');
    return JSON.parse(cleaned.substring(start, end + 1));
  } catch {
    return null;
  }
}

module.exports = { callGroq, safeParseJSON };
