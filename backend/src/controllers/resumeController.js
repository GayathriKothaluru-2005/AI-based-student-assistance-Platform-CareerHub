const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');

/* ─── Multer: memory storage, 5 MB limit ─── */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are supported.'));
    }
  },
});

/* ─── Extract raw text from file buffer ─── */
async function extractText(file) {
  if (file.mimetype === 'application/pdf') {
    const data = await pdfParse(file.buffer);
    return data.text;
  }
  // DOCX or DOC
  const result = await mammoth.extractRawText({ buffer: file.buffer });
  return result.value;
}

/* ═══════════════════════════════════════════════════════════
   SECTION PARSERS
══════════════════════════════════════════════════════════ */

function parseEducation(lines) {
  const education = [];
  let current = null;

  const degreeRx = /\b(b\.?\s*tech|m\.?\s*tech|b\.?\s*e\.?|m\.?\s*e\.?|b\.?\s*sc|m\.?\s*sc|ph\.?\s*d|bachelor|master|diploma|intermediate|10th|12th|ssc|hsc|puc|bca|mca|mba|bba)\b/i;
  const yearRx = /\b(19|20)\d{2}\b/;
  const gpaRx = /(?:cgpa|gpa|percentage|%|marks)[:\s]*([0-9.]+)|([0-9]+\.?[0-9]*)\s*\/\s*10/i;

  for (const line of lines) {
    const degreeMatch = line.match(degreeRx);
    const yearMatch = line.match(yearRx);
    const gpaMatch = line.match(gpaRx);
    const gpaValue = gpaMatch ? (gpaMatch[1] || gpaMatch[2] || '') : '';

    if (degreeMatch) {
      if (current) education.push(current);
      current = {
        degree: degreeMatch[0].toUpperCase(),
        institution: '',
        field: '',
        year: yearMatch ? yearMatch[0] : '',
        gpa: gpaValue,
      };
      // Try to extract field from same line: "B.Tech in Computer Science"
      const fieldMatch = line.match(/\b(?:in|of)\s+([A-Za-z\s&.]+?)(?:\s+(?:from|at)\b|,|$)/i);
      if (fieldMatch) current.field = fieldMatch[1].trim();
    } else if (current && !current.institution) {
      current.institution = line;
      if (yearMatch && !current.year) current.year = yearMatch[0];
      if (gpaValue && !current.gpa) current.gpa = gpaValue;
    } else if (current && yearMatch && !current.year) {
      current.year = yearMatch[0];
      if (gpaValue && !current.gpa) current.gpa = gpaValue;
    } else if (current && gpaValue && !current.gpa) {
      current.gpa = gpaValue;
    } else if (current && !current.field && !yearMatch && !gpaMatch && line.length < 80) {
      current.field = line;
    }
  }
  if (current) education.push(current);
  return education;
}

function parseSkills(lines) {
  const allText = lines.join(' ');

  const techRx = /\b(java(?:script)?|python|typescript|c\+\+|c#|ruby|php|swift|kotlin|golang|rust|r\b|matlab|scala|bash|shell|sql|html5?|css3?|react\.?js?|angular|vue\.?js?|node\.?js?|express\.?js?|spring\s*boot?|django|flask|laravel|next\.?js?|nuxt|svelte|mongodb|mysql|postgresql|sqlite|redis|firebase|graphql|rest(?:\s*api)?|soap|docker|kubernetes|aws|azure|gcp|git|linux|android|ios|tensorflow|pytorch|keras|scikit.learn|pandas|numpy|machine\s*learning|deep\s*learning|nlp|computer\s*vision|data\s*science|hadoop|spark|kafka|elasticsearch|fastapi|hibernate|jdbc|servlet|microservices|blockchain|solidity|jquery|bootstrap|tailwind|webpack|vite|jest|selenium|cypress|flutter|dart|unity|opencv)\b/ig;

  const toolRx = /\b(vs\s*code|visual\s*studio|intellij|eclipse|pycharm|xcode|android\s*studio|postman|insomnia|swagger|jira|confluence|trello|notion|figma|sketch|adobe\s*xd|photoshop|illustrator|excel|tableau|power\s*bi|looker|jupyter|google\s*colab|kaggle|heroku|vercel|netlify|render|railway|github|gitlab|bitbucket|jenkins|travis\s*ci|circleci|github\s*actions|npm|yarn|pip|maven|gradle|vim|neovim|sublime)\b/ig;

  const softRx = /\b(leadership|communication|teamwork|team\s*player|problem.solving|analytical|critical.thinking|time.management|adaptability|creativity|collaboration|presentation|research|mentoring|self.motivated|fast.learner|detail.oriented|organized|initiative|proactive)\b/ig;

  const techMatches = [...new Set((allText.match(techRx) || []).map(s => s.trim()))];
  const toolMatches = [...new Set((allText.match(toolRx) || []).map(s => s.trim()))];
  const softMatches = [...new Set((allText.match(softRx) || []).map(s => s.trim()))];

  // Fallback: if no regex matches, use lines directly as technical skills
  let technical = techMatches.join(', ');
  if (!technical) {
    technical = lines
      .map(l => l.replace(/^[•\-*:]\s*/, '').trim())
      .filter(l => l.length > 1 && l.length < 120)
      .join(', ');
  }

  return {
    technical,
    soft: softMatches.join(', '),
    tools: toolMatches.join(', '),
  };
}

function parseExperience(lines) {
  const experience = [];
  let current = null;

  const durationRx = /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[a-z]*\.?\s*['']?\d{2,4}?\s*[-–—to]+\s*(?:present|current|now|jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[a-z]*\.?\s*['']?\d*\b/i;
  const yearRangeRx = /\b(20\d{2})\s*[-–—]\s*(20\d{2}|present|current)\b/i;

  for (const line of lines) {
    const durationMatch = line.match(durationRx) || line.match(yearRangeRx);

    if (durationMatch) {
      if (current && (current.company || current.role)) experience.push(current);
      const rest = line.replace(durationMatch[0], '').replace(/[|]/g, ' ').trim();
      const parts = rest.split(/\s{2,}/).map(p => p.replace(/[-–—]$/, '').trim()).filter(Boolean);
      current = {
        role: parts[0] || '',
        company: parts[1] || '',
        duration: durationMatch[0],
        description: '',
      };
    } else if (current) {
      const isBullet = /^[•\-*]\s*/.test(line);
      if (!current.company && !isBullet && line.length < 100) {
        if (!current.role) {
          current.role = line;
        } else {
          current.company = line;
        }
      } else {
        const bullet = line.replace(/^[•\-*]\s*/, '');
        current.description += (current.description ? '\n• ' : '• ') + bullet;
      }
    }
  }
  if (current && (current.company || current.role)) experience.push(current);
  return experience;
}

function parseProjects(lines) {
  const projects = [];
  let current = null;

  for (const line of lines) {
    const urlMatch = line.match(/(?:https?:\/\/[^\s]+|(?:github|gitlab)\.com\/[^\s]+)/i);
    const techLineMatch = line.match(/(?:tech(?:nologies)?|stack|built\s*with|tools?|languages?)[:\s|]+(.+)/i);
    // Parenthesised tech list: "(React, Node.js, MongoDB)"
    const parenTechMatch = !techLineMatch && line.match(/^\(([A-Za-z0-9,\s.+#/|-]+)\)$/) ? line.match(/^\(([^)]+)\)$/) : null;

    if (urlMatch && current) {
      current.link = urlMatch[0];
    } else if ((techLineMatch || parenTechMatch) && current) {
      current.tech = (techLineMatch ? techLineMatch[1] : parenTechMatch[1]).trim();
    } else if (/^[•\-*]\s*/.test(line)) {
      // Bullet-style project title
      if (current) projects.push(current);
      current = { name: line.replace(/^[•\-*]\s*/, ''), description: '', tech: '', link: '' };
    } else if (!current || (current.name && current.description.length > 30)) {
      if (current) projects.push(current);
      current = { name: line, description: '', tech: '', link: '' };
    } else if (current && !current.description) {
      current.description = line;
    } else if (current) {
      current.description += ' ' + line;
    }
  }
  if (current) projects.push(current);
  return projects.filter(p => p.name && p.name.length > 2);
}

function parseCertifications(lines) {
  return lines
    .filter(l => l.length > 2)
    .map(line => {
      const yearMatch = line.match(/\b(20\d{2})\b/);
      const clean = line.replace(/^[•\-*]\s*/, '').replace(/\b20\d{2}\b/, '').trim();
      const issuerMatch = clean.match(/(?:\s[-|–]\s|\s+by\s+|\s+from\s+)([A-Za-z\s&]+)$/i);
      return {
        name: issuerMatch ? clean.replace(issuerMatch[0], '').trim() : clean,
        issuer: issuerMatch ? issuerMatch[1].trim() : '',
        year: yearMatch ? yearMatch[0] : '',
      };
    })
    .filter(c => c.name.length > 2);
}

/* ═══════════════════════════════════════════════════════════
   MAIN PARSE FUNCTION
══════════════════════════════════════════════════════════ */
function parseResumeText(rawText) {
  const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  /* ── Personal info via regex on full text ── */
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  // Indian mobile or international phone
  const phoneMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}|\+?\d[\d\s\-(). ]{7,14}\d/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/([A-Za-z0-9_-]+)/i);
  const githubMatch = text.match(/github\.com\/([A-Za-z0-9_-]+)/i);

  // Name: first non-empty line
  const name = lines[0] || '';

  // Location: scan first 15 lines for city/country pattern
  let location = '';
  for (let i = 1; i < Math.min(15, lines.length); i++) {
    const l = lines[i];
    if (!l || l === name) continue;
    if (/@/.test(l) || /\d{7,}/.test(l)) continue; // skip email/phone lines
    if (
      /(?:hyderabad|bangalore|bengaluru|chennai|mumbai|delhi|pune|kolkata|andhra\s*pradesh|telangana|karnataka|india|gujarat|rajasthan|maharashtra|kerala|tamilnadu|tamil\s*nadu)/i.test(l) ||
      (/^[A-Za-z\s,.-]+$/.test(l) && l.includes(',') && l.split(',').length >= 2 && l.length < 60)
    ) {
      location = l;
      break;
    }
  }

  /* ── Section detection ── */
  const sectionPatterns = [
    { key: 'summary',        rx: /^(summary|objective|profile|about\s*me|professional\s*summary|career\s*objective|personal\s*statement)/i },
    { key: 'education',      rx: /^(education|academic\s*(background|details|qualifications?)?|qualifications?|academics?|educational\s*(details|background)?)/i },
    { key: 'experience',     rx: /^(experience|work\s*experience|employment|professional\s*experience|internship[s]?|work\s*history|industrial\s*training)/i },
    { key: 'skills',         rx: /^(skills?|technical\s*skills?|core\s*competencies?|expertise|technologies|programming\s*languages?|key\s*skills?|competencies?)/i },
    { key: 'projects',       rx: /^(projects?|personal\s*projects?|academic\s*projects?|significant\s*projects?|key\s*projects?|mini\s*projects?)/i },
    { key: 'certifications', rx: /^(certifications?|certificates?|achievements?|awards?|licenses?|accomplishments?|courses?|online\s*courses?|training)/i },
  ];

  const sectionStarts = [];
  lines.forEach((line, idx) => {
    for (const { key, rx } of sectionPatterns) {
      if (rx.test(line) && line.length < 60 && !/@/.test(line)) {
        sectionStarts.push({ key, idx });
        break;
      }
    }
  });

  const sections = {};
  for (let s = 0; s < sectionStarts.length; s++) {
    const { key, idx } = sectionStarts[s];
    const endIdx = s + 1 < sectionStarts.length ? sectionStarts[s + 1].idx : lines.length;
    sections[key] = lines.slice(idx + 1, endIdx).filter(l => l.length > 0);
  }

  /* ── Parse each section ── */
  const summary = (sections.summary || []).join(' ');
  const education = parseEducation(sections.education || []);
  const skills = parseSkills(sections.skills || []);
  const experience = parseExperience(sections.experience || []);
  const projects = parseProjects(sections.projects || []);
  const certifications = parseCertifications(sections.certifications || []);

  return {
    personal: {
      name,
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0].trim() : '',
      location,
      linkedin: linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : '',
      github: githubMatch ? `github.com/${githubMatch[1]}` : '',
      website: '',
      summary,
    },
    education: education.length ? education : [{ institution: '', degree: '', field: '', year: '', gpa: '' }],
    skills,
    projects,
    experience,
    certifications,
  };
}

/* ═══════════════════════════════════════════════════════════
   AI-POWERED PARSER  (Groq — LLaMA 3.3 70B)
══════════════════════════════════════════════════════════ */
async function parseResumeWithAI(rawText) {
  const key = process.env.GROQ_API_KEY_RESUME;
  if (!key) throw new Error('GROQ_API_KEY_RESUME not configured');

  const prompt = `You are a resume parser. Extract information from the resume text below and return ONLY valid JSON — no markdown, no extra text.

JSON structure to fill:
{
  "personal": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "website": "",
    "summary": ""
  },
  "education": [
    { "degree": "", "institution": "", "field": "", "year": "", "gpa": "" }
  ],
  "skills": {
    "technical": "comma-separated technical skills",
    "soft": "comma-separated soft skills",
    "tools": "comma-separated tools and software"
  },
  "experience": [
    { "role": "", "company": "", "duration": "", "description": "" }
  ],
  "projects": [
    { "name": "", "description": "", "tech": "", "link": "" }
  ],
  "certifications": [
    { "name": "", "issuer": "", "year": "" }
  ]
}

Resume text:
${rawText.substring(0, 6000)}`;

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
      temperature: 0.1,
    },
    {
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      timeout: 40000,
    }
  );

  const content = response.data.choices[0]?.message?.content || '';
  const cleaned = content.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('AI returned no valid JSON');
  return JSON.parse(cleaned.substring(start, end + 1));
}

/* ─── Express route handler ─── */
const parseResume = [
  upload.single('resume'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
      const rawText = await extractText(req.file);
      if (!rawText || rawText.trim().length < 20) {
        return res.status(422).json({ message: 'Could not extract readable text from this file. Please try a different format.' });
      }

      let parsed;
      let usedAI = false;

      // Try AI-powered parsing first
      try {
        parsed = await parseResumeWithAI(rawText);
        usedAI = true;
      } catch (aiErr) {
        console.warn('AI parse failed, falling back to regex parser:', aiErr.message);
        parsed = parseResumeText(rawText);
      }

      return res.json({ success: true, data: parsed, parsedBy: usedAI ? 'ai' : 'regex' });
    } catch (err) {
      console.error('Resume parse error:', err.message);
      return res.status(500).json({ message: 'Failed to parse resume.', error: err.message });
    }
  },
];

module.exports = { parseResume };
