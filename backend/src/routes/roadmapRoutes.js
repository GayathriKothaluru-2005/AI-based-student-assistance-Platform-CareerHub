const express = require('express');
const router = express.Router();
const { generateRoadmap } = require('../controllers/roadmapController');

// POST /api/roadmap/generate
router.post('/generate', generateRoadmap);

module.exports = router;
