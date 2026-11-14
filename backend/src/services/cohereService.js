/**
 * cohereService.js
 * Cohere API integration for AI-powered study suggestions for timetable generator.
 */

const axios = require('axios');

const COHERE_API_URL = 'https://api.cohere.com/v1/generate';
const COHERE_API_KEY = process.env.COHERE_API_KEY || '5f41aQQ4o3UxXo0Vfw36xKjYbgm9WPgYMcKlMpxl';

/**
 * Generate study suggestions for a timetable using Cohere API
 * @param {Object} timetableData - The generated timetable with subjects
 * @returns {Promise<string>} AI-generated study suggestions
 */
async function generateStudySuggestions(timetableData) {
  if (!COHERE_API_KEY) {
    return getLocalFallbackSuggestions(timetableData);
  }

  try {
    const prompt = buildTimetablePrompt(timetableData);

    const response = await axios.post(
      COHERE_API_URL,
      {
        model: 'command',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.8,
        stop_sequences: [],
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
          'Cohere-Version': '2021-11-08',
        },
        timeout: 30000,
      }
    );

    return response.data.generations[0]?.text?.trim() || getLocalFallbackSuggestions(timetableData);
  } catch (err) {
    console.error('Cohere API error:', err.message);
    // Fall back to local suggestions if API fails
    return getLocalFallbackSuggestions(timetableData);
  }
}

/**
 * Build a prompt for Cohere based on timetable data
 */
function buildTimetablePrompt(timetableData) {
  const subjectsList = timetableData.subjects
    .map(s => `${s.name} (Difficulty: ${s.difficulty}, Exam: ${s.examDate}, Daily Hours: ${s.dailyHours})`)
    .join('\n');

  return `Based on this study timetable for a student with the following subjects:

${subjectsList}

Study Window: ${timetableData.studyWindow.start} - ${timetableData.studyWindow.end}

Provide 5-7 personalized AI-powered study suggestions to maximize learning efficiency. Consider:
1. Subject difficulty levels and exam dates
2. Break patterns and revision sessions
3. Optimal focus times and study habits
4. Revision frequency for difficult subjects

Suggestions:`;
}

/**
 * Local fallback suggestions when Cohere API is unavailable
 */
function getLocalFallbackSuggestions(timetableData) {
  const hardestSubject = timetableData.subjects.sort(
    (a, b) => (b.difficulty || 0) - (a.difficulty || 0)
  )[0];

  const nearestExam = timetableData.subjects.sort((a, b) => {
    const dateA = new Date(a.examDate);
    const dateB = new Date(b.examDate);
    return dateA - dateB;
  })[0];

  const suggestions = [
    `💪 Focus on "${hardestSubject?.name || 'the most difficult subject'}" during peak hours (${timetableData.studyWindow.start}-${timetableData.studyWindow.end}) when your concentration is highest.`,
    `📅 Your nearest exam is "${nearestExam?.name || 'upcoming'}" on ${nearestExam?.examDate || 'soon'}. Allocate extra revision sessions for this subject.`,
    `🔄 Follow the built-in break pattern after 90 minutes of focused study. This helps consolidate learning and prevent burnout.`,
    `📚 Review the previous day's lessons for 15-20 minutes before starting new topics. Spaced repetition is crucial for long-term retention.`,
    `⏰ Maintain consistency with your timetable. Studies show that fixed study hours are more effective than cramming.`,
    `🎯 Track your daily progress in the dashboard. Visual feedback improves motivation and helps identify weak areas.`,
  ];

  return suggestions.join('\n\n');
}

module.exports = { generateStudySuggestions, getLocalFallbackSuggestions };
