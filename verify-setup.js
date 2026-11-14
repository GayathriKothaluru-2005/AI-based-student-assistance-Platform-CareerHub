#!/usr/bin/env node

/**
 * Troubleshooting Script for Student Platform
 * Run from project root: node verify-setup.js
 */

const http = require('http');
const axios = require('axios');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function checkBackendHealth() {
  log('\n📡 Checking Backend Health...', 'blue');
  
  try {
    const response = await axios.get('http://localhost:5000/health', { timeout: 3000 });
    log('✅ Backend is running on port 5000', 'green');
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log('❌ Cannot connect to backend on port 5000', 'red');
      log('   Solution: Run "npm run dev" in backend folder', 'yellow');
    } else if (error.code === 'ENOTFOUND') {
      log('❌ Localhost not found', 'red');
    } else {
      log(`❌ Backend health check failed: ${error.message}`, 'red');
    }
    return false;
  }
}

async function checkAuthEndpoint() {
  log('\n🔐 Checking Auth Endpoint...', 'blue');
  
  try {
    const response = await axios.get('http://localhost:5000/api/auth/verify', {
      timeout: 3000,
      headers: {
        'Authorization': 'Bearer invalid-token'
      },
      validateStatus: () => true // Don't throw on any status
    });
    
    if (response.status === 401) {
      log('✅ Auth endpoint is accessible (returns 401 as expected)', 'green');
      return true;
    } else if (response.status === 404) {
      log('❌ Auth endpoint not found (404)', 'red');
      log('   Check that routes are properly configured', 'yellow');
      return false;
    } else {
      log(`✅ Auth endpoint accessible (status: ${response.status})`, 'green');
      return true;
    }
  } catch (error) {
    log(`❌ Auth endpoint check failed: ${error.message}`, 'red');
    return false;
  }
}

async function checkInterviewPrepEndpoint() {
  log('\n📝 Checking Interview Prep Endpoint...', 'blue');
  
  try {
    const response = await axios.get('http://localhost:5000/api/interview-prep/list', {
      timeout: 3000,
      headers: {
        'Authorization': 'Bearer invalid-token'
      },
      validateStatus: () => true
    });
    
    if (response.status === 401 || response.status === 403) {
      log('✅ Interview prep endpoint is accessible (auth required)', 'green');
      return true;
    } else if (response.status === 404) {
      log('❌ Interview prep endpoint not found', 'red');
      return false;
    } else {
      log(`✅ Interview prep endpoint accessible (status: ${response.status})`, 'green');
      return true;
    }
  } catch (error) {
    log(`❌ Interview prep endpoint check failed: ${error.message}`, 'red');
    return false;
  }
}

async function checkEnvironmentVariables() {
  log('\n🔧 Checking Environment Variables...', 'blue');
  
  // Check frontend .env
  try {
    const fs = require('fs');
    const frontendEnv = fs.readFileSync('frontend/.env', 'utf-8');
    
    if (frontendEnv.includes('REACT_APP_API_URL')) {
      log('✅ frontend/.env has REACT_APP_API_URL', 'green');
    } else {
      log('⚠️  frontend/.env missing REACT_APP_API_URL', 'yellow');
    }
    
    if (frontendEnv.includes('REACT_APP_GOOGLE_CLIENT_ID')) {
      log('✅ frontend/.env has REACT_APP_GOOGLE_CLIENT_ID', 'green');
    } else {
      log('⚠️  frontend/.env missing REACT_APP_GOOGLE_CLIENT_ID', 'yellow');
    }
  } catch (error) {
    log('⚠️  Cannot read frontend/.env', 'yellow');
  }
  
  // Check backend .env
  try {
    const fs = require('fs');
    const backendEnv = fs.readFileSync('backend/.env', 'utf-8');
    
    if (backendEnv.includes('DB_HOST')) {
      log('✅ backend/.env has DB_HOST', 'green');
    } else {
      log('⚠️  backend/.env missing DB_HOST', 'yellow');
    }
    
    if (backendEnv.includes('JWT_SECRET')) {
      log('✅ backend/.env has JWT_SECRET', 'green');
    } else {
      log('⚠️  backend/.env missing JWT_SECRET', 'yellow');
    }
  } catch (error) {
    log('⚠️  Cannot read backend/.env', 'yellow');
  }
}

async function runAllChecks() {
  log('\n╔════════════════════════════════════════════╗', 'blue');
  log('║  Student Platform - Verification Script   ║', 'blue');
  log('╚════════════════════════════════════════════╝', 'blue');
  
  const results = [];
  
  results.push(await checkBackendHealth());
  if (results[0]) {
    results.push(await checkAuthEndpoint());
    results.push(await checkInterviewPrepEndpoint());
  }
  
  await checkEnvironmentVariables();
  
  log('\n╔════════════════════════════════════════════╗', 'blue');
  log('║  Summary                                   ║', 'blue');
  log('╚════════════════════════════════════════════╝', 'blue');
  
  const allPassed = results.every(r => r === true);
  if (allPassed) {
    log('✅ All checks passed! Your setup is ready.', 'green');
  } else {
    log('⚠️  Some checks failed. See details above.', 'yellow');
  }
  
  log('\n📖 For detailed setup instructions, see PRODUCTION_SETUP.md\n', 'blue');
}

runAllChecks().catch(error => {
  log(`\nFatal error: ${error.message}`, 'red');
  process.exit(1);
});
