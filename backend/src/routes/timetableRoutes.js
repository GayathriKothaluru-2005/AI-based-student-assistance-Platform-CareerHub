/**
 * timetableRoutes.js
 * Routes for timetable generation and management
 */

const express = require('express');
const router = express.Router();
const {
  generateTimetable,
  getTimetableSummary,
} = require('../controllers/timetableController');

/**
 * POST /timetable/generate
 * Generate an optimized timetable based on subjects and study preferences
 * 
 * Body:
 * {
 *   subjects: [
 *     { name: 'Mathematics', difficulty: 8, examDate: '2024-04-15', dailyHours: 2 },
 *     { name: 'Physics', difficulty: 7, examDate: '2024-04-20', dailyHours: 2 }
 *   ],
 *   studyWindowStart: '09:00',
 *   studyWindowEnd: '17:00',
 *   dailyHours: 6
 * }
 */
router.post('/generate', generateTimetable);

/**
 * POST /timetable/summary
 * Get a summary of the generated timetable
 * 
 * Body:
 * {
 *   timetable: { ... }
 * }
 */
router.post('/summary', getTimetableSummary);

module.exports = router;
