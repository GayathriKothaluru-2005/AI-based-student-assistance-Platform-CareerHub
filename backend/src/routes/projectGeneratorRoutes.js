const express = require('express');
const { generateProjects } = require('../controllers/projectGeneratorController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/project-generator/generate
 * Generate project ideas based on skill level and tech stack
 * Authentication: Required
 */
router.post('/generate', auth, generateProjects);

module.exports = router;
