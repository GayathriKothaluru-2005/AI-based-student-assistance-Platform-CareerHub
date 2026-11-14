const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfSummarizerController = require('../controllers/pdfSummarizerController');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Routes
router.post('/summarize', upload.single('pdf'), pdfSummarizerController.summarizePDF);

module.exports = router;
