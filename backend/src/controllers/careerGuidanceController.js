/**
 * careerGuidanceController.js
 * Powers the Career Guidance AI chatbot (CareerCompass).
 * Teammate repo: https://github.com/SivaSatwikaKothaluru/career-compass
 */

const { callGroq } = require('../services/groqService');

const SYSTEM_PROMPT = `You are CareerCompass — a warm, highly knowledgeable, and deeply supportive AI career counselor built specifically for students navigating academic and professional decisions.

## Your Personality
- Encouraging but honest: celebrate strengths while gently addressing skill gaps
- Practical: give concrete, actionable steps — never vague advice
- Student-first: adapt guidance to each student's background, location, year of study, and goals
- Modern: stay current with industry trends, emerging roles, and top learning platforms in 2024–2025
- Conversational: speak like a knowledgeable senior friend, not a corporate consultant

## Your Expertise
- Tech careers: Software Engineering, Data Science, AI/ML, Cybersecurity, DevOps, Cloud, Product Management, UI/UX
- Non-tech careers: Finance, Healthcare, Law, Civil Services, Marketing, Entrepreneurship
- Academic guidance: entrance exams, studying abroad, scholarships
- Skill roadmaps with timelines and specific platforms
- Resume, LinkedIn, internships, interviews, networking`;

const chatHandler = async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request. Please provide messages.' });
  }

  if (messages.length > 100) {
    return res.status(400).json({ error: 'Too many messages in conversation history.' });
  }

  const invalidMsg = messages.find(
    (m) =>
      !m ||
      !['user', 'assistant'].includes(m.role) ||
      typeof m.content !== 'string' ||
      m.content.trim().length === 0
  );
  if (invalidMsg) {
    return res.status(400).json({ error: 'Invalid message format.' });
  }

  try {
    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(({ role, content }) => ({ role, content: content.trim() })),
    ];

    const reply = await callGroq(groqMessages, 1500, process.env.GROQ_API_KEY_CAREER);
    res.json({ role: 'assistant', content: reply });
  } catch (err) {
    console.error('Career Guidance Chat Error:', err.message);
    if (err.message.includes('GROQ_API_KEY')) {
      return res.status(500).json({ error: err.message });
    }
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
};

module.exports = { chatHandler };
