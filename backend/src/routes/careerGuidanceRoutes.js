const express = require('express');
const router = express.Router();
const { chatHandler } = require('../controllers/careerGuidanceController');

// POST /api/career-guidance/chat
router.post('/chat', chatHandler);

module.exports = router;
