const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Updated to use the latest stable Gemini model
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Validate API key on service load
if (!GEMINI_API_KEY) {
  console.error('❌ CRITICAL: GEMINI_API_KEY not set in environment variables');
  console.error('Resume upload will use fallback questions instead of AI generation');
}

// Generate interview questions using Gemini AI
const generateInterviewQuestions = async (resumeText, parsedResume) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured. Using default questions instead.');
    }

    const prompt = `You are an expert interview coach. Based on the provided resume, generate personalized interview questions in the following categories.

RESUME TEXT:
${resumeText}

PARSED RESUME DATA:
${JSON.stringify(parsedResume, null, 2)}

Generate interview questions in EXACTLY this JSON format (no markdown, pure JSON):
{
  "hrQuestions": [
    "question 1",
    "question 2",
    "question 3"
  ],
  "technicalQuestions": [
    "question 1",
    "question 2",
    "question 3"
  ],
  "projectQuestions": [
    "question 1",
    "question 2",
    "question 3"
  ],
  "experienceQuestions": [
    "question 1",
    "question 2",
    "question 3"
  ],
  "resumeBasedQuestions": [
    "question 1",
    "question 2",
    "question 3"
  ]
}

Rules:
1. CRITICAL: Every question MUST be specific to this candidate's resume
2. Reference actual company names, project names, skills, and technologies
3. Mention specific experiences and achievements from their resume
4. Ask about the actual technologies they used
5. Do NOT generate generic questions - personalize everything
6. Each category should have 3-5 questions
7. Questions should feel like a real interviewer studied their resume
8. Return ONLY the JSON object, no additional text`;

    console.log('Calling Gemini API for interview questions...');
    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    }, {
      timeout: 30000,
    });

    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiResponse) {
      throw new Error('No response from Gemini API');
    }

    console.log('Successfully generated interview questions from AI');
    // Parse JSON from the response
    const questions = safeParseJSON(aiResponse);
    return questions || null;

  } catch (error) {
    console.error('⚠️  Error generating interview questions with Gemini:', error.message);
    if (error.response?.status === 429) {
      console.error('Rate limit hit - will use fallback questions');
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('API authentication failed - check GEMINI_API_KEY');
    } else {
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
    }
    return null; // Return null to trigger fallback in controller
  }
};

// Generate resume analysis using Gemini AI
const generateResumeAnalysis = async (resumeText) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured. Using fallback analysis.');
    }
    
    const prompt = `You are an expert HR and career coach. Analyze the provided resume and give insights in JSON format.

RESUME TEXT:
${resumeText}

Return analysis in EXACTLY this JSON format:
{
  "experienceLevel": "beginner/intermediate/advanced/expert",
  "techStack": ["skill1", "skill2", "skill3"],
  "keyStrengths": ["strength1", "strength2", "strength3"],
  "potentialRoles": ["role1", "role2", "role3"],
  "interviewFocus": "what interviewer will likely focus on",
  "recommendedPrepAreas": ["area1", "area2", "area3"]
}

Return ONLY the JSON object, no additional text.`;

    console.log('Calling Gemini API for resume analysis...');
    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    }, {
      timeout: 30000,
    });

    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiResponse) {
      throw new Error('No response from Gemini API');
    }

    console.log('Successfully generated resume analysis from AI');
    return safeParseJSON(aiResponse) || null;

  } catch (error) {
    console.error('⚠️  Error generating resume analysis with Gemini:', error.message);
    if (error.response?.status === 429) {
      console.error('Rate limit hit - will use fallback analysis');
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('API authentication failed - check GEMINI_API_KEY');
    } else {
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
    }
    return null; // Return null to trigger fallback in controller
  }
};

// Generate feedback for practice answer
const generateAnswerFeedback = async (question, userAnswer, resumeContext) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    
    const prompt = `You are an expert interview coach. Provide constructive feedback on the candidate's answer.

QUESTION: ${question}

CANDIDATE'S ANSWER: ${userAnswer}

RESUME CONTEXT: ${resumeContext}

Return feedback in EXACTLY this JSON format:
{
  "score": 1-10,
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "improvedAnswer": "suggest a better way to answer this question",
  "tips": ["tip1", "tip2", "tip3"]
}

Return ONLY the JSON object, no additional text.`;

    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    }, {
      timeout: 30000,
    });

    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiResponse) {
      throw new Error('No response from Gemini API');
    }

    return safeParseJSON(aiResponse) || {};

  } catch (error) {
    console.error('Error generating feedback:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    return {};
  }
};

// Helper function to safely parse JSON
const safeParseJSON = (text) => {
  try {
    // Find first { or [ and last } or ]
    const startIndex = Math.max(text.indexOf('{'), text.indexOf('['));
    const lastBraceIndex = text.lastIndexOf('}');
    const lastBracketIndex = text.lastIndexOf(']');
    const endIndex = Math.max(lastBraceIndex, lastBracketIndex);

    if (startIndex === -1 || endIndex === -1) {
      return null;
    }

    const jsonStr = text.substring(startIndex, endIndex + 1);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('JSON parse error:', error.message);
    return null;
  }
};

// Create context-aware default questions if AI fails
const createDefaultQuestions = (parsedResume) => {
  // Extract context from parsed resume
  const skills = (parsedResume.skills || []).slice(0, 3);
  const primarySkill = skills[0] || 'programming';
  const skillsList = skills.join(', ');
  const hasExperience = parsedResume.experience && parsedResume.experience.length > 0;
  const hasProjects = parsedResume.projects && parsedResume.projects.length > 0;
  const hasEducation = parsedResume.education && parsedResume.education.length > 0;
  
  const firstExp = hasExperience ? parsedResume.experience[0] : null;
  const firstProj = hasProjects ? parsedResume.projects[0] : null;
  const firstEdu = hasEducation ? parsedResume.education[0] : null;
  
  return {
    hrQuestions: [
      'Tell me about yourself and your professional background.',
      firstExp ? `Walk us through your role as ${firstExp.role || 'a professional'} at ${firstExp.company || 'your company'}.` : 'Tell us about your work experience.',
      skillsList ? `Why are you interested in working with ${skillsList}?` : 'What interests you most about this position?',
      'What are your greatest strengths and how do they apply to this role?',
      'How do you handle technical challenges and pressure when working on projects?',
    ],
    technicalQuestions: [
      skillsList ? `Describe your experience with ${skillsList}.` : 'What programming languages and frameworks are you proficient with?',
      skillsList ? `You have experience with ${skillsList}. When would you use each one and why?` : 'How do you choose the right technology for a project?',
      'Walk us through your approach to solving a complex technical problem.',
      firstProj ? `What technical challenges did you face in ${firstProj.title || 'your recent project'} and how did you solve them?` : 'Tell us about a challenging bug or issue you debugged.',
      'How do you stay current with emerging technologies and best practices?',
    ],
    projectQuestions: [
      firstProj ? `Tell us about your project: "${firstProj.title || 'your project'}".` : 'Describe one of your notable projects.',
      firstProj && firstProj.description ? `${firstProj.description} What was your role and contribution?` : 'What was your role and key contributions to your projects?',
      hasProjects ? `You have ${parsedResume.projects.length} projects. Walk us through your architecture decisions.` : 'How would you design the architecture for your projects?',
      'What technologies did you use in your projects and why did you choose them?',
      firstProj ? `Looking back at ${firstProj.title || 'your project'}}, what would you do differently today?` : 'If you could rebuild one of your projects, what would you change?',
    ],
    experienceQuestions: [
      firstExp ? `Tell us about your experience as ${firstExp.role || 'a developer'} at ${firstExp.company || 'your previous company'}.` : 'Walk us through your professional experience.',
      firstExp ? `What was your biggest achievement or contribution during ${firstExp.duration || 'your tenure'}?` : 'What accomplishments are you most proud of?',
      hasExperience ? 'How did you contribute to your team and collaborate with colleagues?' : 'Tell us about your teamwork experience.',
      hasExperience ? `How does your experience prepare you to take on new responsibilities?` : 'How would your experience benefit this position?',
      skillsList ? `Describe a project where you used ${skillsList} to deliver business value.` : 'Tell us about a project that demonstrates your technical capabilities.',
    ],
    resumeBasedQuestions: [
      skillsList ? `You listed ${skillsList} as key skills. Provide specific examples of projects where you used each.` : 'Elaborate on the skills you listed on your resume.',
      firstEdu ? `Tell us about your education: ${firstEdu.degree || 'your degree'}. How has it prepared you?` : 'Walk us through your educational background and how it shaped your career.',
      hasProjects ? `You have ${parsedResume.projects.length} projects. Which one best demonstrates your capabilities and why?` : 'Which of your projects best showcases your technical abilities?',
      skillsList ? `How did you develop expertise in ${primarySkill}?` : 'How did you build your technical foundation?',
      `Looking at your resume, what areas are you most interested in developing further and why?`,
    ],
  };
};

module.exports = {
  generateInterviewQuestions,
  generateResumeAnalysis,
  generateAnswerFeedback,
  safeParseJSON,
};
