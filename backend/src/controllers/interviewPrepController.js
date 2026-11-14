const InterviewPrep = require('../models/InterviewPrep');
const { generateInterviewQuestions, generateResumeAnalysis, generateAnswerFeedback } = require('../services/geminiInterviewService');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

// Parse resume text based on file type
const parseResumeText = async (fileBuffer, mimeType) => {
  let text = '';

  if (mimeType === 'application/pdf') {
    const pdfData = await pdfParse(fileBuffer);
    text = pdfData.text;
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
             mimeType === 'application/msword') {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    text = result.value;
  } else {
    throw new Error('Unsupported file format. Please upload PDF or DOCX.');
  }

  return text;
};

// Extract structured data from resume
const extractResumeData = (resumeText) => {
  const parsed = {
    name: extractName(resumeText),
    email: extractEmail(resumeText),
    phone: extractPhone(resumeText),
    skills: extractSkills(resumeText),
    experience: extractExperience(resumeText),
    education: extractEducation(resumeText),
    projects: extractProjects(resumeText),
  };

  console.log('Extracted resume data:', JSON.stringify(parsed, null, 2));
  return parsed;
};

const extractName = (text) => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Skip common header lines and extract first valid name
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    let line = lines[i].trim();
    
    // Remove leading bullets/numbers
    line = line.replace(/^[-•*]\s+/, '').trim();
    
    // Skip if it looks like an email, phone, or common headers
    if (line.includes('@') || line.includes('http') || /^\d+[-.]/.test(line)) continue;
    if (/^(resume|cv|curriculum|vitae|contact|skills?|experience|education|tools?|projects?|languages?)/i.test(line)) continue;
    if (line.length > 100) continue; // Too long for a name
    
    // Check if line looks like a name (2-4 words, mostly letters)
    // Allow hyphens and spaces
    if (/^[A-Za-z\s\-\.]{3,}$/.test(line) && line.split(' ').length <= 5) {
      const name = line.trim();
      if (name.length >= 3 && name.length < 100) {
        return name;
      }
    }
  }
  
  return 'Candidate';
};

const extractEmail = (text) => {
  // More robust email regex - captures email and ensures clean extraction
  const emailRegex = /\b([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/;
  const match = text.match(emailRegex);
  if (match) {
    const email = match[1].toLowerCase();
    // Ensure no extra text
    return email.split(/[^a-zA-Z0-9.@_%-]/)[0];
  }
  return '';
};

const extractPhone = (text) => {
  // Multiple phone number formats: +1-123-456-7890, (123) 456-7890, 123-456-7890, etc.
  const phoneRegexes = [
    /\+\d{1,3}\s?[-\.\s]?\d{1,4}[-\.\s]?\d{1,4}[-\.\s]?\d{1,9}(?![\d])/,
    /\(\d{3}\)\s?\d{3}[-\.\s]?\d{4}/,
    /\d{3}[-\.]\d{3}[-\.]\d{4}/,
    /\+?1?\s*\d{10}(?![\d])/
  ];
  
  for (const regex of phoneRegexes) {
    const match = text.match(regex);
    if (match) {
      const phone = match[0].trim();
      // Ensure it's not just numbers without structure
      if (phone.replace(/\D/g, '').length >= 10) {
        return phone;
      }
    }
  }
  
  return '';
};

const extractSkills = (text) => {
  const skills = new Set();
  
  // Look for skills section
  const skillsSectionRegex = /(?:skills?|technical\s+skills?|core\s+competencies|technical\s+expertise|technologies?|programming\s+languages?|tools?\s*&?\s*technologies?)([\s\S]*?)(?:experience|education|projects?|certifications?|languages?|$)/i;
  const skillsMatch = text.match(skillsSectionRegex);
  
  if (skillsMatch) {
    const skillsText = skillsMatch[1];
    // Split by common delimiters
    const skillItems = skillsText.split(/[,\n•\-\*|]/);
    
    skillItems.forEach(item => {
      const skill = item.trim();
      if (skill.length > 1 && skill.length < 50 && !/^(\d+|years?|months?)$/i.test(skill)) {
        skills.add(skill);
      }
    });
  }
  
  // Also look for common programming languages and frameworks in the entire text
  const commonTechs = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
    'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Oracle', 'SQL Server',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Git', 'Jenkins',
    'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap',
    'REST', 'GraphQL', 'API', 'MVC', 'MVVM',
    'Linux', 'Windows', 'MacOS', 'Unix'
  ];
  
  commonTechs.forEach(tech => {
    const regex = new RegExp('\\b' + tech + '\\b', 'gi');
    if (regex.test(text)) {
      skills.add(tech);
    }
  });
  
  return Array.from(skills).slice(0, 25);
};

const extractExperience = (text) => {
  const experiences = [];
  const lines = text.split('\n');
  
  // Look for experience section
  const expSectionStart = text.search(/(?:work\s+)?experience|employment|professional\s+history/i);
  if (expSectionStart === -1) return [];
  
  // Get text from experience section until next major section
  const expText = text.substring(expSectionStart);
  const nextSection = expText.search(/education|projects?|certifications?|skills?|contact|$(?![\s\S])/i);
  const experienceBlock = nextSection > -1 ? expText.substring(0, nextSection) : expText;
  
  // Try to find company and position patterns
  const patterns = [
    // Pattern: Company Name | Position Title (Date Range)
    /^([^|\n]+?)\s*\|\s*([^\n]+?)\s*\(([^)]+)\)/gm,
    // Pattern: Position Title at Company Name (Date Range)
    /([A-Za-z\s]+?)\s+at\s+([^,\n]+),?\s*\(([^)]+)\)/gi,
    // Pattern: Company Name ... Position Title ... Date
    /^([A-Z][A-Za-z\s]+)\s*\n\s*([A-Z][A-Za-z\s]+).*?\n.*?(\d{4}[\s\-]+\d{4}|\d{1,2}\/\d{4}[\s\-]+\d{1,2}\/\d{4})/gm,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(experienceBlock)) !== null && experiences.length < 5) {
      experiences.push({
        company: match[1].trim(),
        role: match[2].trim(),
        duration: match[3].trim(),
      });
    }
    if (experiences.length >= 3) break;
  }
  
  // If still no matches, try to extract lines with years
  if (experiences.length === 0) {
    const yearPattern = /(\d{4})/;
    lines.forEach((line, idx) => {
      if (yearPattern.test(line) && line.length > 10) {
        const nextLine = lines[idx + 1];
        experiences.push({
          company: line.split(/\d{4}/)[0].trim() || 'Company',
          role: nextLine?.trim() || 'Position',
          duration: line.match(/\d{4}[\s\-]*\d{4}/)?.[0] || 'Recent',
        });
      }
      if (experiences.length >= 5) return;
    });
  }
  
  return experiences.slice(0, 5);
};

const extractEducation = (text) => {
  const education = [];
  
  // Look for education section
  const eduSection = text.match(/(?:education|academic|degree)([\s\S]*?)(?:experience|projects?|skills?|$)/i);
  if (!eduSection) return [];
  
  const eduText = eduSection[1];
  
  // Common degree patterns
  const degreePatterns = [
    /(?:bachelor|bachelor\'s|b\.?\s*a\.?|b\.?\s*s\.?|b\.?\s*tech|b\.?tech)\s+(?:in\s+)?([^,\n]+)/gi,
    /(?:master|master\'s|m\.?\s*a\.?|m\.?\s*s\.?|m\.?\s*tech|m\.?tech)\s+(?:in\s+)?([^,\n]+)/gi,
    /(?:phd|doctorate|ph\.?d\.?)\s+(?:in\s+)?([^,\n]+)/gi,
    /([^,\n]+)\s*-?\s*(?:bachelor|master|phd|diploma|b\.?tech|m\.?tech)/gi,
  ];
  
  degreePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(eduText)) !== null && education.length < 3) {
      education.push({
        degree: match[0].trim(),
        field: match[1]?.trim() || '',
      });
    }
  });
  
  // Also look for university names
  const universityPattern = /(?:university|college|institute|school)\s+(?:of\s+)?([^,\n]+)/gi;
  let uMatch;
  while ((uMatch = universityPattern.exec(eduText)) !== null && education.length < 3) {
    if (!education.some(e => e.degree.toLowerCase().includes(uMatch[1].toLowerCase()))) {
      education.push({
        degree: 'Degree from ' + uMatch[1].trim(),
        field: '',
      });
    }
  }
  
  return education.slice(0, 3);
};

const extractProjects = (text) => {
  const projects = [];
  const lines = text.split('\n');
  
  // Look for projects section
  const projectsSectionStart = text.search(/(?:projects?|portfolio|side\s+projects?)/i);
  if (projectsSectionStart === -1) return [];
  
  const projectsText = text.substring(projectsSectionStart);
  const nextSection = projectsText.search(/skills?|experience|education|certifications?|$(?![\s\S])/i);
  const projectsBlock = nextSection > -1 ? projectsText.substring(0, nextSection) : projectsText;
  
  // Try to extract project names and descriptions
  const projectLines = projectsBlock.split('\n');
  
  for (let i = 0; i < projectLines.length && projects.length < 5; i++) {
    const line = projectLines[i].trim();
    
    // Skip short lines or section headers
    if (line.length < 5 || /^(projects?|portfolio)$/i.test(line)) continue;
    
    // Look for project indicators
    if (/^[-•*]\s+/.test(line) || /^[A-Z][^.!?]*:\s*/.test(line) || /\([a-zA-Z,\s]+\)/.test(line)) {
      const title = line.replace(/^[-•*]\s+/, '').substring(0, 100);
      const description = projectLines[i + 1]?.trim() || '';
      
      if (title.length > 3) {
        projects.push({
          title: title,
          description: description.substring(0, 200),
        });
      }
    }
  }
  
  return projects.slice(0, 5);
};

// Helper function to create default questions
const createDefaultQuestions = (parsedResume) => {
  return {
    hrQuestions: [
      'Tell me about yourself.',
      'Why are you interested in this position?',
      'What are your greatest strengths?',
      'What are some areas you want to improve?',
      'How do you handle pressure and deadlines?',
    ],
    technicalQuestions: [
      'Explain the architecture of a recent project you built.',
      'What programming languages are you most comfortable with?',
      'How do you approach debugging a problem?',
      'What databases have you worked with and why?',
      'Explain your understanding of RESTful APIs.',
    ],
    projectQuestions: [
      'Tell me about the most complex project you have worked on.',
      'What challenges did you face and how did you overcome them?',
      'How would you improve one of your past projects?',
      'What did you learn from your most recent project?',
      'Have you worked on any open-source projects?',
    ],
    experienceQuestions: [
      'Describe your previous work experience.',
      'What was your role in your internship/job?',
      'How did you contribute to your team?',
      'What was the biggest achievement in your previous role?',
      'Why did you leave your previous position?',
    ],
    resumeBasedQuestions: [
      'Can you explain the technical stack you used in your projects?',
      'Walk me through your educational background.',
      'Tell me more about the skills you listed.',
    ],
  };
};

// Upload resume and generate questions
exports.uploadResume = async (req, res) => {
  try {
    // Validate user authentication
    if (!req.user || !req.user.id) {
      console.error('Auth error: req.user not found or missing id');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id;
    console.log(`Starting resume upload for user: ${userId}`);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log(`File uploaded: ${req.file.originalname}, size: ${req.file.size}, mime: ${req.file.mimetype}`);

    const validMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!validMimes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Only PDF and DOCX files are supported' });
    }

    // Parse resume text
    console.log('Parsing resume text...');
    const resumeText = await parseResumeText(req.file.buffer, req.file.mimetype);

    if (resumeText.trim().length === 0) {
      return res.status(400).json({ message: 'Resume file is empty or unreadable' });
    }

    console.log(`Resume text parsed. Length: ${resumeText.length}`);

    // Extract structured data
    console.log('Extracting resume structure...');
    const parsedResume = extractResumeData(resumeText);
    console.log('Resume structure extracted:', JSON.stringify(parsedResume).substring(0, 200));

    // Generate AI analysis - with fallback
    let resumeAnalysis = {};
    try {
      console.log('Generating AI resume analysis...');
      resumeAnalysis = await generateResumeAnalysis(resumeText);
      
      // If service returned null, use fallback
      if (!resumeAnalysis) {
        console.warn('Resume analysis returned null, using fallback');
        resumeAnalysis = {
          experienceLevel: 'intermediate',
          techStack: parsedResume.skills || [],
          keyStrengths: ['Problem solving', 'Learning ability'],
          potentialRoles: ['Software Developer', 'Software Engineer'],
          interviewFocus: 'Technical skills and project experience',
          recommendedPrepAreas: ['Data Structures', 'System Design'],
        };
      } else {
        console.log('Resume analysis generated successfully');
      }
    } catch (analysisError) {
      console.warn('Resume analysis failed, using fallback:', analysisError.message);
      resumeAnalysis = {
        experienceLevel: 'intermediate',
        techStack: parsedResume.skills || [],
        keyStrengths: ['Problem solving', 'Learning ability'],
        potentialRoles: ['Software Developer', 'Software Engineer'],
        interviewFocus: 'Technical skills and project experience',
        recommendedPrepAreas: ['Data Structures', 'System Design'],
      };
    }

    // Generate interview questions - with fallback
    let interviewQuestions = {};
    try {
      console.log('Generating interview questions...');
      interviewQuestions = await generateInterviewQuestions(resumeText, parsedResume);
      
      // If service returned null, use fallback
      if (!interviewQuestions) {
        console.warn('Interview questions returned null, using default questions');
        interviewQuestions = createDefaultQuestions(parsedResume);
      } else {
        console.log('Interview questions generated successfully');
      }
    } catch (questionsError) {
      console.warn('Interview questions failed, using default questions:', questionsError.message);
      interviewQuestions = createDefaultQuestions(parsedResume);
    }

    // Save to database
    console.log('Saving to database...');
    const interviewPrep = await InterviewPrep.create({
      userId,
      resumeText: resumeText.substring(0, 500000),
      parsedResume,
      resumeAnalysis,
      interviewQuestions,
      fileName: req.file.originalname,
    });

    console.log(`Resume saved successfully with ID: ${interviewPrep.id}`);

    res.status(201).json({
      message: 'Resume processed successfully',
      interviewPrep: {
        id: interviewPrep.id,
        fileName: interviewPrep.fileName,
        parsedResume: interviewPrep.parsedResume,
        resumeAnalysis: interviewPrep.resumeAnalysis,
        interviewQuestions: interviewPrep.interviewQuestions,
      },
    });

  } catch (error) {
    console.error('❌ UPLOAD RESUME ERROR:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    let statusCode = 500;
    let errorMessage = 'Failed to process resume';

    if (error.message.includes('GEMINI_API_KEY')) {
      errorMessage = 'AI service not configured. Please contact support.';
    } else if (error.message.includes('database') || error.message.includes('FOREIGN KEY')) {
      statusCode = 503;
      errorMessage = 'Database error. Please ensure you are logged in.';
    } else if (error.message.includes('timeout')) {
      statusCode = 504;
      errorMessage = 'Request timeout. The AI service took too long to respond.';
    }

    res.status(statusCode).json({
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get saved resume and questions
exports.getInterviewPrep = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { prepId } = req.params;

    let interviewPrep;

    if (prepId) {
      interviewPrep = await InterviewPrep.findOne({
        where: { id: prepId, userId },
      });
    } else {
      // Get most recent
      interviewPrep = await InterviewPrep.findOne({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });
    }

    if (!interviewPrep) {
      return res.status(404).json({ message: 'Interview prep not found' });
    }

    res.json({
      id: interviewPrep.id,
      fileName: interviewPrep.fileName,
      parsedResume: interviewPrep.parsedResume,
      resumeAnalysis: interviewPrep.resumeAnalysis,
      interviewQuestions: interviewPrep.interviewQuestions,
      createdAt: interviewPrep.createdAt,
    });

  } catch (error) {
    console.error('Get interview prep error:', error);
    res.status(500).json({
      message: 'Failed to fetch interview prep',
      error: error.message,
    });
  }
};

// Get all interview preps for user
exports.getAllInterviewPreps = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const interviewPreps = await InterviewPrep.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'fileName', 'createdAt'],
    });

    res.json({
      count: interviewPreps.length,
      interviewPreps,
    });

  } catch (error) {
    console.error('Get all interview preps error:', error);
    res.status(500).json({
      message: 'Failed to fetch interview preps',
      error: error.message,
    });
  }
};

// Submit answer and get feedback
exports.submitAnswer = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { prepId } = req.params;
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const interviewPrep = await InterviewPrep.findOne({
      where: { id: prepId, userId },
    });

    if (!interviewPrep) {
      return res.status(404).json({ message: 'Interview prep not found' });
    }

    // Generate feedback
    const feedback = await generateAnswerFeedback(
      question,
      answer,
      JSON.stringify(interviewPrep.parsedResume)
    );

    // Save to practice history
    const practiceEntry = {
      question,
      userAnswer: answer,
      feedback,
      timestamp: new Date(),
    };

    const practiceHistory = Array.isArray(interviewPrep.practiceHistory) 
      ? interviewPrep.practiceHistory 
      : [];
    
    practiceHistory.push(practiceEntry);

    await interviewPrep.update({
      practiceHistory: practiceHistory.slice(-50), // Keep last 50 attempts
    });

    res.json({
      feedback,
      practiceEntry,
    });

  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      message: 'Failed to process answer',
      error: error.message,
    });
  }
};

// Delete interview prep
exports.deleteInterviewPrep = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { prepId } = req.params;

    const interviewPrep = await InterviewPrep.findOne({
      where: { id: prepId, userId },
    });

    if (!interviewPrep) {
      return res.status(404).json({ message: 'Interview prep not found' });
    }

    await interviewPrep.destroy();

    res.json({ message: 'Interview prep deleted successfully' });

  } catch (error) {
    console.error('Delete interview prep error:', error);
    res.status(500).json({
      message: 'Failed to delete interview prep',
      error: error.message,
    });
  }
};


