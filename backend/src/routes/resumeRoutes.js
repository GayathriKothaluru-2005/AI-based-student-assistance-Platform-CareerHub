const express = require('express');
const router = express.Router();
const { parseResume } = require('../controllers/resumeController');

// POST /api/resume/parse  — accepts multipart/form-data with field "resume"
router.post('/parse', parseResume);

module.exports = router;
