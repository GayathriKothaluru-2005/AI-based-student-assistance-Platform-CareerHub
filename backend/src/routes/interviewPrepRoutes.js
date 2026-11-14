const express = require('express');
const multer = require('multer');
const authenticateToken = require('../middleware/auth');
const interviewPrepController = require('../controllers/interviewPrepController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  },
});

// Protected routes
router.post('/upload', authenticateToken, upload.single('resume'), interviewPrepController.uploadResume);
router.get('/list', authenticateToken, interviewPrepController.getAllInterviewPreps);
router.get('/:prepId', authenticateToken, interviewPrepController.getInterviewPrep);
router.get('/', authenticateToken, interviewPrepController.getInterviewPrep);
router.post('/:prepId/submit-answer', authenticateToken, interviewPrepController.submitAnswer);
router.delete('/:prepId', authenticateToken, interviewPrepController.deleteInterviewPrep);

module.exports = router;
