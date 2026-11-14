const express = require('express');
const router = express.Router();
const { analyzeJD, matchSkills, generateJDRoadmap, jdChat } = require('../controllers/jdController');

// POST /api/jd/analyze       — analyze JD text or PDF
router.post('/analyze', analyzeJD);

// POST /api/jd/match-skills  — compare JD vs resume
router.post('/match-skills', matchSkills);

// POST /api/jd/roadmap       — generate learning roadmap from missing skills
router.post('/roadmap', generateJDRoadmap);

// POST /api/jd/chat          — career Q&A about a JD
router.post('/chat', jdChat);

module.exports = router;
