const axios = require('axios');
const pdfParse = require('pdf-parse');
const { callGroq } = require('./groqService');

/**
 * Extract text from PDF buffer
 */
async function extractTextFromPDF(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);
    const text = data.text;
    
    if (!text || text.trim().length === 0) {
      throw new Error('Unable to extract text from PDF. File may be corrupted or image-based.');
    }
    
    // Limit to first 12000 characters 
    return text.substring(0, 12000);
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
}

/**
 * Generate structured summary using Groq API (using proven callGroq function)
 */
async function generateSummaryWithCohere(text, title = 'Document') {
  try {
    console.log('📝 Starting PDF summarization...');
    console.log('  - Text length:', text.length);
    console.log('  - Using Groq API');

    // Simple prompt for summarization 
    const prompt = `Please provide a structured summary of this document with key points:\n\n${text.substring(0, 3000)}`;

    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ];

    console.log('Calling Groq API...');
    const summary = await callGroq(messages, 1000, process.env.GROQ_API_KEY_CAREER);
    
    console.log('✅ Groq API successful');
    
    // Return structured format
    return {
      executiveSummary: summary,
      keyPoints: summary.split('\n').filter(line => line.trim().length > 0),
      definitions: [],
      insights: [],
      easyExplanation: summary,
      raw: summary
    };
  } catch (error) {
    console.error('\n❌ PDF Summarization Error:');
    console.error('Error:', error.message);
    
    throw new Error(`Summary generation failed: ${error.message}`);
  }
}

/**
 * Clean and format text by removing special characters and markdown
 */
function cleanText(text) {
  if (!text) return '';
  
  return text
    // Remove markdown bold, italic
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/__/g, '')
    .replace(/_/g, '')
    .replace(/`/g, '')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse structured summary into sections
 */
function parseSummary(summaryText) {
  const sections = {
    executiveSummary: cleanText(extractSection(summaryText, 'EXECUTIVE SUMMARY')),
    keyPoints: extractBullets(summaryText, 'KEY POINTS').map(point => cleanText(point)),
    definitions: extractBullets(summaryText, 'IMPORTANT DEFINITIONS').map(def => cleanText(def)),
    insights: extractBullets(summaryText, 'CRITICAL INSIGHTS').map(insight => cleanText(insight)),
    easyExplanation: cleanText(extractSection(summaryText, 'SUMMARY IN SIMPLE WORDS')),
    raw: cleanText(summaryText)
  };
  
  return sections;
}

/**
 * Extract section content between headers
 */
function extractSection(text, header) {
  const regex = new RegExp(`---${header}---\\s*(.+?)(?=---|$)`, 'is');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * Extract bullet points from section
 */
function extractBullets(text, header) {
  const section = extractSection(text, header);
  const bullets = section
    .split('\n')
    .filter(line => line.trim().length > 0 && (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*') || line.trim().match(/^\d+\./)))
    .map(line => line.replace(/^[•\-*\d.]\s*/, '').trim())
    .filter(line => line.length > 0);
  
  return bullets;
}

/**
 * Fallback: Create a simple summary by extracting key sentences
 */
function createSimpleSummary(text, title = 'Document') {
  // Split text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  const summary = {
    executiveSummary: sentences.slice(0, 2).join(' ').trim() || 'Summary generation in progress.',
    keyPoints: sentences.slice(2, 7).map(s => s.trim()),
    definitions: ['Refer to full document for detailed definitions'],
    insights: ['PDF summarization service is being processed'],
    easyExplanation: 'This is the document content. Please review for detailed information.',
    raw: text
  };
  
  return summary;
}

module.exports = {
  extractTextFromPDF,
  generateSummaryWithCohere,
  parseSummary,
  createSimpleSummary
};
