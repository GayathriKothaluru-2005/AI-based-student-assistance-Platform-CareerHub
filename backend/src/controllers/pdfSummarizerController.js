const { extractTextFromPDF, generateSummaryWithCohere, createSimpleSummary } = require('../services/pdfSummarizerService');

/**
 * POST /summarize - Summarize uploaded PDF
 */
exports.summarizePDF = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Verify file type
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are supported' });
    }

    // Check file size (50MB limit)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (req.file.size > MAX_SIZE) {
      return res.status(400).json({ error: 'File size exceeds 50MB limit' });
    }

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(req.file.buffer);

    // Generate summary (with fallback)
    let summary;
    try {
      summary = await generateSummaryWithCohere(extractedText, req.file.originalname);
    } catch (error) {
      console.warn('⚠️ Groq API failed, using fallback summary generation...');
      summary = createSimpleSummary(extractedText, req.file.originalname);
    }

    // Return result
    res.json({
      success: true,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      summary: summary
    });
  } catch (error) {
    console.error('PDF Summarization Error:', error);
    res.status(500).json({ error: error.message || 'Failed to summarize PDF' });
  }
};
