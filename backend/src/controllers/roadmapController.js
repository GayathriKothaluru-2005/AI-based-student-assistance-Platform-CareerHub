/**
 * roadmapController.js
 * AI-Powered topic-based learning roadmap generator.
 * Teammate repo: https://github.com/GayathriKothaluru-2005/Roadmap-generator
 *
 * Endpoint: POST /api/roadmap/generate
 */

const { callGroq, safeParseJSON } = require('../services/groqService');

const ROADMAP_SYSTEM_PROMPT = `You are an expert career mentor and curriculum designer.
When given a technology keyword or subject, generate a structured learning roadmap with three stages.
Return ONLY valid JSON — no markdown, no extra text:
{
  "beginner": [{"topic": "...", "explanation": "...", "tools": ["..."]}],
  "intermediate": [{"topic": "...", "explanation": "...", "tools": ["..."]}],
  "advanced": [{"topic": "...", "explanation": "...", "tools": ["..."]}]
}
Each stage: 4-6 modules. Each module has: topic (string), 1-2 sentence explanation, tools array (3-5 items).`;

const generateRoadmap = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Please provide a topic.' });
    }

    const safeTopic = topic.trim().substring(0, 200);

    const raw = await callGroq(
      [
        { role: 'system', content: ROADMAP_SYSTEM_PROMPT },
        { role: 'user', content: `Generate a learning roadmap for: "${safeTopic}"` },
      ],
      2048,
      process.env.GROQ_API_KEY_ROADMAP
    );

    const roadmap = safeParseJSON(raw);

    if (!roadmap?.beginner || !roadmap?.intermediate || !roadmap?.advanced) {
      return res.status(500).json({ error: 'AI returned invalid format. Please try again.' });
    }

    return res.json({ topic: safeTopic, roadmap });
  } catch (err) {
    console.error('generateRoadmap Error:', err.message);
    return res.status(500).json({ error: err.message || 'Server error. Please try again.' });
  }
};

module.exports = { generateRoadmap };
