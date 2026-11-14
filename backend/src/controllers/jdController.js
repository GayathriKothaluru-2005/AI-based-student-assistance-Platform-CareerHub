/**
 * jdController.js
 * Student-Friendly Job Description Analyzer.
 * Teammate repo: https://github.com/Pavanikuppani/student-friendly-jd-summarizer
 *
 * Endpoints:
 *   POST /api/jd/analyze        — Analyze a JD (text or PDF)
 *   POST /api/jd/match-skills   — Compare JD vs resume
 *   POST /api/jd/roadmap        — Generate learning roadmap from missing skills
 *   POST /api/jd/chat           — Ask career questions about a JD
 */

const multer = require('multer');
const pdfParse = require('pdf-parse');
const { callGroq, safeParseJSON } = require('../services/groqService');

/* ─── Multer: memory storage, PDF only, 5 MB limit ─── */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported for JD upload.'));
    }
  },
});

async function extractPDFText(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

/* ─── POST /api/jd/analyze ─── */
const analyzeJD = [
  upload.single('jdFile'),
  async (req, res) => {
    try {
      let jdText = '';

      if (req.file) {
        jdText = await extractPDFText(req.file.buffer);
      } else if (req.body.jdText) {
        jdText = req.body.jdText.trim();
      } else {
        return res.status(400).json({ error: 'Please provide a job description as text or upload a PDF file.' });
      }

      if (jdText.length < 50) {
        return res.status(400).json({ error: 'Job description is too short. Please provide more details.' });
      }

      const mode = req.body.mode || 'student';

      const summaryPrompt =
        mode === 'student'
          ? `You are a friendly career assistant helping students understand job postings.

Analyze this job description and respond ONLY with valid JSON (no markdown, no extra text):

${jdText}

Return this exact JSON structure:
{
  "roleOverview": "2-3 sentence simple explanation of what this job is about",
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "toolsAndTech": ["tool1", "tool2", "tool3"],
  "experienceLevel": "Entry-level / Mid-level / Senior",
  "simpleSummary": "One paragraph explaining this job as if talking to a college student",
  "difficultyMeter": "Easy / Medium / Hard",
  "difficultyReason": "Short reason why",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "salaryRange": "Estimated salary range if you can infer it, else Not specified",
  "roleType": "Full-time / Part-time / Internship / Contract"
}`
          : `You are a professional career consultant creating structured job analysis reports.

Analyze this job description and respond ONLY with valid JSON (no markdown, no extra text):

${jdText}

Return this exact JSON structure:
{
  "roleOverview": "Formal 3-4 sentence professional summary of the position",
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "toolsAndTech": ["tool1", "tool2", "tool3"],
  "experienceLevel": "Entry-level / Mid-level / Senior / Lead",
  "simpleSummary": "Professional structured summary with key responsibilities",
  "difficultyMeter": "Easy / Medium / Hard",
  "difficultyReason": "Professional assessment of role complexity",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "salaryRange": "Estimated market salary range based on role and skills",
  "roleType": "Full-time / Part-time / Contract / Remote"
}`;

      const keywordsPrompt = `Extract the most important keywords from this job description that a candidate should include in their resume.

Job Description:
${jdText}

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "mustHaveKeywords": ["keyword1", "keyword2"],
  "technicalKeywords": ["tech1", "tech2"],
  "softSkillKeywords": ["skill1", "skill2"],
  "resumeTips": ["Specific tip on how to use these keywords in resume"]
}`;

      const [summaryRaw, keywordsRaw] = await Promise.all([
        callGroq([{ role: 'user', content: summaryPrompt }], 2000, process.env.GROQ_API_KEY_JD),
        callGroq([{ role: 'user', content: keywordsPrompt }], 1000, process.env.GROQ_API_KEY_JD),
      ]);

      const summary = safeParseJSON(summaryRaw);
      const keywords = safeParseJSON(keywordsRaw);

      return res.json({
        success: true,
        mode,
        jdPreview: jdText.substring(0, 500) + (jdText.length > 500 ? '...' : ''),
        summary,
        keywords,
      });
    } catch (error) {
      console.error('analyzeJD Error:', error.message);
      return res.status(500).json({ error: error.message || 'Failed to analyze job description.' });
    }
  },
];

/* ─── POST /api/jd/match-skills ─── */
const matchSkills = [
  upload.single('resumeFile'),
  async (req, res) => {
    try {
      const { jdText, resumeText } = req.body;

      if (!jdText || jdText.trim().length < 50) {
        return res.status(400).json({ error: 'Please provide a valid job description (at least 50 characters).' });
      }

      const finalResumeText = req.file ? await extractPDFText(req.file.buffer) : resumeText;

      if (!finalResumeText || finalResumeText.trim().length < 30) {
        return res.status(400).json({ error: 'Please provide your resume text or upload a resume PDF.' });
      }

      const prompt = `You are a career advisor comparing a job description with a student's resume.

Job Description:
${jdText}

Student Resume:
${finalResumeText}

Analyze carefully and respond ONLY with valid JSON (no markdown, no extra text):
{
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "niceToHaveSkills": ["skill1", "skill2"],
  "matchPercentage": 75,
  "strengths": ["What the candidate does well"],
  "suggestions": ["Specific improvement suggestions"],
  "overallVerdict": "Brief overall assessment in 2 sentences"
}

Be accurate. matchPercentage should be a number 0-100.`;

      const raw = await callGroq([{ role: 'user', content: prompt }], 1500, process.env.GROQ_API_KEY_JD);
      const result = safeParseJSON(raw);

      return res.json({ success: true, ...result });
    } catch (error) {
      console.error('matchSkills Error:', error.message);
      return res.status(500).json({ error: error.message || 'Failed to analyze skills.' });
    }
  },
];

/* ─── POST /api/jd/roadmap ─── */
const generateJDRoadmap = async (req, res) => {
  try {
    const { missingSkills, jobTitle } = req.body;

    if (!missingSkills || missingSkills.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one missing skill.' });
    }

    const skillsList = Array.isArray(missingSkills) ? missingSkills.join(', ') : missingSkills;

    const prompt = `You are a learning coach helping a student become job-ready for ${jobTitle || 'the target job'}.
The student is missing these skills: ${skillsList}

Create a realistic step-by-step learning roadmap. Respond ONLY with valid JSON (no markdown, no extra text):
{
  "totalWeeks": 12,
  "phases": [
    {
      "phase": 1,
      "title": "Phase title",
      "duration": "2 weeks",
      "skills": ["skill1", "skill2"],
      "tasks": [
        "Specific task or resource to complete",
        "Another specific task"
      ],
      "resources": [
        {"name": "Resource name", "type": "Course/Video/Book/Practice", "url": "https://example.com"}
      ],
      "milestone": "What you can do after this phase"
    }
  ],
  "tips": ["Practical tip 1", "Practical tip 2", "Practical tip 3"],
  "estimatedJobReadiness": "When the student will be ready to apply"
}

Make it practical, specific, and encouraging. Include real resources like freeCodeCamp, MDN, YouTube, etc.`;

    const raw = await callGroq([{ role: 'user', content: prompt }], 2500, process.env.GROQ_API_KEY_JD);
    const roadmap = safeParseJSON(raw);

    return res.json({ success: true, jobTitle: jobTitle || 'Target Role', roadmap });
  } catch (error) {
    console.error('generateJDRoadmap Error:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to generate roadmap.' });
  }
};

/* ─── POST /api/jd/chat ─── */
const jdChat = async (req, res) => {
  try {
    const { question, history } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a question.' });
    }

    if (question.trim().length > 1000) {
      return res.status(400).json({ error: 'Question is too long. Please keep it under 1000 characters.' });
    }

    const contextMessages = (history || [])
      .slice(-6)
      .map((m) => `${m.role === 'user' ? 'Student' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const prompt = `You are a friendly, knowledgeable career assistant helping students with job searching and career development.

${contextMessages ? `Previous conversation:\n${contextMessages}\n` : ''}
Student's question: ${question}

Answer helpfully and simply. If it is a technical question, explain it clearly with an example.
If it is a career question, give practical, actionable advice.
Keep your response conversational and encouraging. Max 3-4 paragraphs.`;

    const answer = await callGroq([{ role: 'user', content: prompt }], 800, process.env.GROQ_API_KEY_JD);
    return res.json({ success: true, question, answer });
  } catch (error) {
    console.error('jdChat Error:', error.message);
    return res.status(500).json({ error: error.message || 'Chat service unavailable.' });
  }
};

module.exports = { analyzeJD, matchSkills, generateJDRoadmap, jdChat };
