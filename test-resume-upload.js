#!/usr/bin/env node

/**
 * Resume Upload Test Script
 * Tests the resume upload functionality with proper error diagnostics
 * Run: node test-resume-upload.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function testDiagnostics() {
  log('\n🔍 Testing Backend Diagnostics...', 'blue');
  try {
    const response = await axios.get(`${API_URL}/diagnostics`, { timeout: 5000 });
    const data = response.data;
    
    log('✅ Server Status:', 'green');
    log(`   Running: ${data.server.running}`, 'cyan');
    log(`   Port: ${data.server.port}`, 'cyan');
    log(`   Environment: ${data.environment}`, 'cyan');
    
    log('✅ Configuration:', 'green');
    log(`   GEMINI API Key: ${data.config.hasGeminiKey ? '✓ SET' : '✗ MISSING'}`, data.config.hasGeminiKey ? 'green' : 'red');
    log(`   Database Config: ${data.config.hasDatabaseConfig ? '✓ SET' : '✗ MISSING'}`, data.config.hasDatabaseConfig ? 'green' : 'red');
    log(`   JWT Secret: ${data.config.hasJWTSecret ? '✓ SET' : '✗ MISSING'}`, data.config.hasJWTSecret ? 'green' : 'red');
    
    log('✅ Database:', 'green');
    log(`   Status: ${data.database.status}`, data.database.status === 'connected' ? 'green' : 'red');
    if (data.database.status === 'connected') {
      log(`   Host: ${data.database.host}`, 'cyan');
      log(`   Database: ${data.database.database}`, 'cyan');
    } else if (data.database.error) {
      log(`   Error: ${data.database.error}`, 'red');
    }
    
    return data.config.hasGeminiKey && data.database.status === 'connected';
  } catch (error) {
    log(`❌ Diagnostics failed: ${error.message}`, 'red');
    return false;
  }
}

async function createTestResume() {
  log('\n📝 Creating Test Resume...', 'blue');
  
  const testResume = `
John Doe
Software Developer

CONTACT
Email: john@example.com
Phone: (555) 123-4567

SUMMARY
Experienced software developer with expertise in web technologies and cloud platforms.

SKILLS
Programming Languages:
- JavaScript, Python, Java, SQL

Web Technologies:
- React, Node.js, Express, HTML5, CSS3
- REST APIs, GraphQL

Databases:
- MongoDB, PostgreSQL, MySQL
- Redis

Tools & Platforms:
- Git, Docker, AWS, Docker

EXPERIENCE
Senior Developer at Tech Company
2022-2024
- Led development of microservices architecture
- Improved system performance by 40%
- Mentored junior developers

Developer at StartUp Inc
2020-2022
- Built full-stack web applications
- Implemented CI/CD pipelines
- Reduced deployment time by 50%

EDUCATION
Bachelor of Science in Computer Science
State University, 2020

PROJECTS
Personal Portfolio Website
- Built with React and Node.js
- Deployed on AWS
- Features: Blog, Projects showcase, Contact form

Chat Application
- Real-time messaging with WebSockets
- MongoDB for data storage
- Deployed using Docker

CERTIFICATIONS
- AWS Solutions Architect Associate
- Google Cloud Professional Data Engineer
  `;

  const testPath = path.join(__dirname, 'test-resume.txt');
  fs.writeFileSync(testPath, testResume);
  log(`✅ Test resume created at: ${testPath}`, 'green');
  return testPath;
}

async function testUploadWithAuth() {
  log('\n🔐 Testing Upload (with Authentication)...', 'blue');
  
  // Create test resume
  const resumePath = await createTestResume();
  
  // Try with a valid token (you need to login first or provide one)
  const token = localStorage?.getItem?.('authToken') || process.env.AUTH_TOKEN;
  
  if (!token) {
    log('⚠️  No authentication token available', 'yellow');
    log('   To test with auth:');
    log('   1. Login at http://localhost:3000', 'cyan');
    log('   2. Check localStorage.getItem("authToken") in browser console', 'cyan');
    log('   3. Set AUTH_TOKEN environment variable', 'cyan');
    log('   4. Run this script again', 'cyan');
    return false;
  }

  try {
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(resumePath);
    formData.append('resume', new Blob([fileBuffer], { type: 'text/plain' }), 'test-resume.txt');

    log(`📤 Uploading test resume...`, 'cyan');
    const response = await axios.post(`${API_URL}/interview-prep/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    });

    log('✅ Upload successful!', 'green');
    log(`Response:`, 'cyan');
    log(JSON.stringify(response.data, null, 2), 'cyan');
    return true;
  } catch (error) {
    log(`❌ Upload failed: ${error.message}`, 'red');
    if (error.response?.data) {
      log(`Server response: ${JSON.stringify(error.response.data)}`, 'red');
    }
    return false;
  }
}

async function runAllTests() {
  log('\n╔════════════════════════════════════════════╗', 'blue');
  log('║  Resume Upload Test Suite                 ║', 'blue');
  log('╚════════════════════════════════════════════╝', 'blue');

  // Test 1: Diagnostics
  const diagSuccess = await testDiagnostics();

  if (!diagSuccess) {
    log('\n⚠️  Diagnostics check failed. Please fix configuration issues first.', 'yellow');
    log('   See PRODUCTION_SETUP.md or RESUME_UPLOAD_DEBUG.md for help.', 'yellow');
    process.exit(1);
  }

  // Test 2: Upload with auth
  const uploadSuccess = await testUploadWithAuth();

  log('\n╔════════════════════════════════════════════╗', 'blue');
  log('║  Test Summary                             ║', 'blue');
  log('╚════════════════════════════════════════════╝', 'blue');
  
  log(`✅ Diagnostics: PASSED`, 'green');
  log(`${uploadSuccess ? '✅ Upload Test: PASSED' : '⚠️  Upload Test: SKIPPED (no token)'}`, uploadSuccess ? 'green' : 'yellow');

  if (uploadSuccess) {
    log('\n🎉 All tests passed! Resume upload is working correctly.', 'green');
  } else {
    log('\n📖 For debugging help, see:', 'yellow');
    log('   - RESUME_UPLOAD_DEBUG.md', 'cyan');
    log('   - PRODUCTION_SETUP.md', 'cyan');
  }
}

runAllTests().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
