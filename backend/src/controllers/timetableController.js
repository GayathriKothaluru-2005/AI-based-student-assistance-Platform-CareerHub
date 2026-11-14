/**
 * timetableController.js
 * Handles timetable generation and AI-powered study suggestions
 */

const { generateStudySuggestions } = require('../services/cohereService');

/**
 * Generate an optimized timetable based on subjects and preferences
 * Algorithm:
 * 1. Sort subjects by (difficulty * exam proximity)
 * 2. Distribute study hours prioritizing harder subjects and nearby exams
 * 3. Insert breaks after 90-minute focus blocks
 * 4. Add revision sessions for high-priority subjects
 */
async function generateTimetable(req, res) {
  try {
    const { subjects, studyWindowStart, studyWindowEnd, dailyHours } = req.body;

    // Validation
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: 'At least one subject is required.' });
    }

    if (!studyWindowStart || !studyWindowEnd || !dailyHours) {
      return res.status(400).json({ error: 'Study window and daily hours are required.' });
    }

    // Calculate priority for each subject (difficulty * exam proximity)
    const today = new Date();
    const enrichedSubjects = subjects.map(s => {
      const examDate = new Date(s.examDate);
      const daysUntilExam = Math.max(1, Math.ceil((examDate - today) / (1000 * 60 * 60 * 24)));
      const difficulty = s.difficulty || 5; // Default 5 if not provided
      const priority = difficulty * (10 / daysUntilExam); // Closer exams = higher priority
      
      return {
        ...s,
        daysUntilExam,
        priority,
      };
    });

    // Sort by priority (descending)
    enrichedSubjects.sort((a, b) => b.priority - a.priority);

    // Generate 7-day timetable
    const timetable = generateSevenDayTimetable(
      enrichedSubjects,
      studyWindowStart,
      studyWindowEnd,
      dailyHours
    );

    // Get AI suggestions
    const studySuggestions = await generateStudySuggestions({
      subjects: enrichedSubjects,
      studyWindow: { start: studyWindowStart, end: studyWindowEnd },
    });

    res.json({
      success: true,
      timetable,
      studySuggestions,
      subjectsAnalysis: enrichedSubjects.map(s => ({
        name: s.name,
        difficulty: s.difficulty,
        examDate: s.examDate,
        daysUntilExam: s.daysUntilExam,
        priority: Math.round(s.priority),
      })),
    });
  } catch (error) {
    console.error('Error generating timetable:', error);
    res.status(500).json({ error: error.message || 'Failed to generate timetable.' });
  }
}

/**
 * Generate a balanced 7-day timetable
 */
function generateSevenDayTimetable(subjects, startTime, endTime, dailyHours) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timetable = {};
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const totalAvailableMinutes = (endHour - startHour) * 60 + (endMin - startMin);
  const dailyMinutes = dailyHours * 60;
  const focusBlockMinutes = 90; // 90-minute focus blocks
  const breakMinutes = 15; // 15-minute breaks

  days.forEach((day, dayIndex) => {
    const sessions = [];
    let currentTime = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
    let remainingMinutes = dailyMinutes;
    let subjectIndex = 0;

    while (remainingMinutes > 0 && sessions.length < 10) {
      const subject = subjects[subjectIndex % subjects.length];
      const sessionDuration = Math.min(focusBlockMinutes, remainingMinutes);

      sessions.push({
        subject: subject.name,
        type: dayIndex % 7 === 6 ? 'revision' : 'study', // Sunday = revision
        startTime: currentTime,
        duration: sessionDuration,
        interval: `${sessionDuration} min`,
        difficulty: subject.difficulty,
        examDate: subject.examDate,
      });

      currentTime = addMinutes(currentTime, sessionDuration);
      remainingMinutes -= sessionDuration;

      // Add break if more study time remains
      if (remainingMinutes > 0) {
        const breakDuration = Math.min(breakMinutes, remainingMinutes / 3); // Proportional break
        sessions.push({
          subject: 'Break',
          type: 'break',
          startTime: currentTime,
          duration: breakDuration,
          interval: `${breakDuration} min`,
        });

        currentTime = addMinutes(currentTime, breakDuration);
        remainingMinutes -= breakDuration;
      }

      subjectIndex++;
    }

    timetable[day] = sessions;
  });

  return timetable;
}

/**
 * Add minutes to a time string (HH:MM format)
 */
function addMinutes(timeStr, minutes) {
  const [hours, mins] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

/**
 * Get timetable summary (for dashboard displays)
 */
function getTimetableSummary(req, res) {
  try {
    const { timetable } = req.body;

    if (!timetable || typeof timetable !== 'object') {
      return res.status(400).json({ error: 'Valid timetable object is required.' });
    }

    const summary = {
      totalDays: Object.keys(timetable).length,
      totalSessions: 0,
      subjectsIncluded: new Set(),
      totalStudyHours: 0,
      breakMinutes: 0,
    };

    Object.values(timetable).forEach(daySessions => {
      daySessions.forEach(session => {
        summary.totalSessions++;
        if (session.type !== 'break') {
          summary.subjectsIncluded.add(session.subject);
          summary.totalStudyHours += session.duration / 60;
        } else {
          summary.breakMinutes += session.duration;
        }
      });
    });

    summary.subjectsIncluded = Array.from(summary.subjectsIncluded);

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
}

module.exports = {
  generateTimetable,
  getTimetableSummary,
};
