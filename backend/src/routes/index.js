const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const contactRoutes = require('./contactRoutes');
const resumeRoutes = require('./resumeRoutes');
const careerGuidanceRoutes = require('./careerGuidanceRoutes');
const jdRoutes = require('./jdRoutes');
const roadmapRoutes = require('./roadmapRoutes');
const timetableRoutes = require('./timetableRoutes');
const pdfSummarizerRoutes = require('./pdfSummarizerRoutes');
const projectGeneratorRoutes = require('./projectGeneratorRoutes');
const interviewPrepRoutes = require('./interviewPrepRoutes');

router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);
router.use('/resume', resumeRoutes);

// AI feature routes
router.use('/career-guidance', careerGuidanceRoutes);
router.use('/jd', jdRoutes);
router.use('/roadmap', roadmapRoutes);
router.use('/timetable', timetableRoutes);
router.use('/pdf-summarizer', pdfSummarizerRoutes);
router.use('/project-generator', projectGeneratorRoutes);
router.use('/interview-prep', interviewPrepRoutes);

module.exports = router;
