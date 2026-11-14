#!/usr/bin/env node

/**
 * Resume Extraction Test Script
 * Tests the improved resume extraction functions
 * Run: node test-extraction.js
 */

// Simple regex patterns for testing (copied from backend)
const extractName = (text) => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    
    if (line.includes('@') || line.includes('http') || /^\d+/.test(line)) continue;
    if (/^(resume|cv|curriculum|vitae|contact|skills?|experience|education)/i.test(line)) continue;
    
    if (/^[A-Za-z\s\-\.]+$/.test(line) && line.length < 60 && line.split(' ').length >= 1) {
      return line.substring(0, 100);
    }
  }
  
  return 'Candidate';
};

const extractEmail = (text) => {
  const emailRegex = /([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const match = text.match(emailRegex);
  return match ? match[1].toLowerCase() : '';
};

const extractPhone = (text) => {
  const phoneRegexes = [
    /\+\d{1,3}\s?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/,
    /\(\d{3}\)\s?\d{3}[-.\s]?\d{4}/,
    /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/,
    /\d{10,}/
  ];
  
  for (const regex of phoneRegexes) {
    const match = text.match(regex);
    if (match) return match[0].trim();
  }
  
  return '';
};

const extractSkills = (text) => {
  const skills = new Set();
  const skillsSectionRegex = /(?:skills?|technical\s+skills?|core\s+competencies|technical\s+expertise|technologies?|programming\s+languages?|tools?\s*&?\s*technologies?)([\s\S]*?)(?:experience|education|projects?|certifications?|languages?|$)/i;
  const skillsMatch = text.match(skillsSectionRegex);
  
  if (skillsMatch) {
    const skillsText = skillsMatch[1];
    const skillItems = skillsText.split(/[,\n•\-\*|]/);
    
    skillItems.forEach(item => {
      const skill = item.trim();
      if (skill.length > 1 && skill.length < 50 && !/^(\d+|years?|months?)$/i.test(skill)) {
        skills.add(skill);
      }
    });
  }
  
  return Array.from(skills).slice(0, 20);
};

// Test data
const testResume1 = `
John Doe
john.doe@example.com
(555) 123-4567

EXPERIENCE
Senior Developer at Tech Corp (2021-2024)
Led development of microservices architecture

EDUCATION
B.S. Computer Science, State University

SKILLS
JavaScript, React, Node.js, MongoDB, AWS

PROJECTS
E-Commerce Platform
Full-stack web application
`;

const testResume2 = `
jane_smith@company.com
+1-555-789-0123
Jane Smith

PROFESSIONAL EXPERIENCE
Software Engineer | Innovation Inc | 2022-Present
- Developed cloud-based applications
- Managed team of developers

Junior Developer at StartUp Co
2020 - 2022

EDUCATION
Master of Science in Computer Science
Bachelor of Technology in IT

TECHNICAL SKILLS
Languages: Python, JavaScript, Java
Frameworks: Django, React, Spring
Databases: MongoDB, PostgreSQL
Cloud: AWS, Azure, Google Cloud
`;

const testResume3 = `
RESUME
Contact: resume@test.com, Phone: 123.456.7890

SKILLS & COMPETENCIES
- Full Stack Development: React, Angular, Vue.js
- Backend: Python, Java, Go, Node.js
- Databases: PostgreSQL, MongoDB, MySQL, Redis
- DevOps: Docker, Kubernetes, AWS

EXPERIENCE
ABC Corp | Senior Engineer | 2019-2023
XYZ Inc | Developer | 2016-2019

EDUCATION
BS Information Technology
MS Computer Science

PROJECTS
AI Chat Platform - Real-time chat application
Data Analytics Dashboard - Analytics tool
`;

// Test function
function testExtraction(name, resume) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TEST: ${name}`);
  console.log(`${'='.repeat(60)}`);
  
  const results = {
    name: extractName(resume),
    email: extractEmail(resume),
    phone: extractPhone(resume),
    skills: extractSkills(resume),
  };
  
  console.log(JSON.stringify(results, null, 2));
  
  // Validate results
  console.log('\n✓ Validation:');
  console.log(`  Name: ${results.name !== 'Candidate' ? '✅ Found' : '❌ Not found'} - "${results.name}"`);
  console.log(`  Email: ${results.email ? '✅ Found' : '❌ Not found'} - "${results.email}"`);
  console.log(`  Phone: ${results.phone ? '✅ Found' : '❌ Not found'} - "${results.phone}"`);
  console.log(`  Skills: ${results.skills.length > 0 ? '✅ Found' : '❌ Not found'} (${results.skills.length} items)`);
  
  return results;
}

// Run tests
console.log('╔════════════════════════════════════════════════╗');
console.log('║  Resume Extraction Test Suite                 ║');
console.log('╚════════════════════════════════════════════════╝');

testExtraction('Standard Resume Format', testResume1);
testExtraction('Alternate Resume Format', testResume2);
testExtraction('Complex Resume Format', testResume3);

// Summary
console.log(`\n${'='.repeat(60)}`);
console.log('TEST SUMMARY');
console.log(`${'='.repeat(60)}`);
console.log(`✅ All extraction tests completed`);
console.log(`\nExpected Results:`);
console.log(`- Name should be extracted (not "Candidate")`);
console.log(`- Email should be found in various formats`);
console.log(`- Phone should be found in various formats`);
console.log(`- Skills should be recognized (multiple items)`);
console.log(`\nNext Steps:`);
console.log(`1. Test with your actual resume`);
console.log(`2. Upload resume in application`);
console.log(`3. Verify extracted data appears correctly`);
console.log(`4. Check backend logs for detailed extraction info`);
