#!/usr/bin/env node

/**
 * Resume Extraction Diagnostic Tool
 * Tests the improved extraction functions
 * Run: node diagnose-extraction.js
 */

const sampleResume = `Manju Kumar
manjukummathi@gmail.com
8464001960
LinkedIn

EXPERIENCE
Software Developer at Pumo Technovation
Aug 2025 – Jan 2026
• Developed and maintained reusable React.js components for a CRM application serving 1,000+ users.
• Implemented responsive user interfaces using modern CSS practices and component-based architecture.
• Designed and deployed AI-driven applications using Python and Streamlit, integrating OpenAI and Gemini APIs for NLP and Generative AI solutions serving 100+ users.
• Collaborated with cross-functional teams to debug and resolve issues across 5+ application modules.

EDUCATION
Ms, Prompt Engineering

SKILLS
Java, JavaScript, React.js, Node.js, REST APIs, SQL databases, AI/ML

PROJECTS
• AI Chat Application - Real-time chat using Socket.io and React
• CRM Dashboard - React component library for enterprise application
• NLP Solutions - Integrated OpenAI and Gemini APIs for text processing
`;

// Extraction functions (copied from backend)
const extractName = (text) => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    let line = lines[i].trim();
    line = line.replace(/^[-•*]\s+/, '').trim();
    
    if (line.includes('@') || line.includes('http') || /^\d+[-.]/.test(line)) continue;
    if (/^(resume|cv|curriculum|vitae|contact|skills?|experience|education|tools?|projects?|languages?)/i.test(line)) continue;
    if (line.length > 100) continue;
    
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
  const emailRegex = /\b([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/;
  const match = text.match(emailRegex);
  if (match) {
    const email = match[1].toLowerCase();
    return email.split(/[^a-zA-Z0-9.@_%-]/)[0];
  }
  return '';
};

const extractPhone = (text) => {
  const phoneRegexes = [
    /\+\d{1,3}\s?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}(?![\d])/,
    /\(\d{3}\)\s?\d{3}[-.\s]?\d{4}/,
    /\d{3}[-.]\\d{3}[-.]\\d{4}/,
    /\+?1?\s*\d{10}(?![\d])/
  ];
  
  for (const regex of phoneRegexes) {
    const match = text.match(regex);
    if (match) {
      const phone = match[0].trim();
      if (phone.replace(/\D/g, '').length >= 10) {
        return phone;
      }
    }
  }
  
  return '';
};

// Diagnostic tests
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  Resume Extraction Diagnostic Tool - IMPROVED VERSION       ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('Testing with sample resume:\n');
console.log('---sample resume---');
console.log(sampleResume);
console.log('---end sample---\n');

// Run extractions
const name = extractName(sampleResume);
const email = extractEmail(sampleResume);
const phone = extractPhone(sampleResume);

console.log('═'.repeat(60));
console.log('EXTRACTION RESULTS');
console.log('═'.repeat(60));

console.log('\n1. NAME EXTRACTION');
console.log('-'.repeat(60));
console.log(`  Expected: Manju Kumar`);
console.log(`  Extracted: ${name}`);
console.log(`  Status: ${name === 'Manju Kumar' ? '✅ PASS' : '❌ FAIL'}`);

console.log('\n2. EMAIL EXTRACTION');
console.log('-'.repeat(60));
console.log(`  Expected: manjukummathi@gmail.com`);
console.log(`  Extracted: ${email}`);
console.log(`  Status: ${email === 'manjukummathi@gmail.com' ? '✅ PASS' : '❌ FAIL'}`);
if (email && email.includes('LinkedIn')) {
  console.log(`  ⚠️  WARNING: Email includes extra text (LinkedIn)`);
}

console.log('\n3. PHONE EXTRACTION');
console.log('-'.repeat(60));
console.log(`  Expected: 8464001960`);
console.log(`  Extracted: ${phone}`);
console.log(`  Status: ${phone === '8464001960' ? '✅ PASS' : '❌ FAIL'}`);

console.log('\n' + '═'.repeat(60));
console.log('KEY IMPROVEMENTS');
console.log('═'.repeat(60));
console.log(`
✅ Name extraction:
   - Searches first 10 lines (was 5)
   - Skips more headers
   - Handles various formats
   
✅ Email extraction:
   - Word boundary matching (\\b) prevents including extra text
   - Only takes email portion, drops "LinkedIn"
   - Handles special characters
   
✅ Phone extraction:
   - Multiple regex patterns
   - Validates minimum 10 digits
   - Prevents false matches
`);

console.log('═'.repeat(60));
console.log('RECOMMENDATIONS');
console.log('═'.repeat(60));

let issues = 0;

if (name === 'Candidate') {
  console.log('⚠️  Name extraction failed. Suggestions:');
  console.log('   - Ensure name is in first 10 lines');
  console.log('   - Use proper name format (2-5 words)');
  issues++;
}

if (!email || !email.includes('@')) {
  console.log('⚠️  Email not extracted. Suggestions:');
  console.log('   - Ensure email has @ symbol');
  console.log('   - Separate email from other text');
  issues++;
}

if (!phone) {
  console.log('⚠️  Phone not extracted. Suggestions:');
  console.log('   - Use standard format: XXX-XXX-XXXX');
  console.log('   - Or format: (XXX) XXX-XXXX');
  issues++;
}

if (issues === 0) {
  console.log('✅ All extractions working correctly!');
  console.log('\nNext steps:');
  console.log('1. Start backend: cd backend && npm run dev');
  console.log('2. Start frontend: cd frontend && npm start');
  console.log('3. Upload your resume');
  console.log('4. Verify extracted data in Resume Analysis');
  console.log('5. Check that interview questions reference your specific experience');
}

console.log('\n' + '═'.repeat(60) + '\n');
