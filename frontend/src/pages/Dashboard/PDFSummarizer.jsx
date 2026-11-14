import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiUpload, FiFile, FiLoader, FiAlertCircle, FiX, FiDownload,FiBook,
  FiBookOpen, FiList, FiZap, FiHeadphones
} from 'react-icons/fi';
import api from '../../utils/api';
import { downloadAsPDF } from '../../utils/downloadUtils';

export default function PDFSummarizer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are supported');
      return;
    }

    // Validate file size (50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      return;
    }

    setFile(selectedFile);
    setError('');
    setSummary(null);
  };

  // Handle PDF upload and summarization
  const handleSummarize = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    setSummary(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const { data } = await api.post('/pdf-summarizer/summarize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSummary(data.summary);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to summarize PDF. Please try again.');
      console.error('PDF Summarization error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF download of summary
  const handleDownloadSummary = async () => {
    if (!summary) return;

    // Clean array by filtering and limiting items
    const cleanArray = (arr) => arr.filter(item => item && item.trim().length > 0).slice(0, 15);
    
    const html = `
      <div style="font-family: 'Calibri', 'Arial', sans-serif; color: #2c3e50; background: white; line-height: 1.8; padding: 50px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 50px 30px; text-align: center; margin-bottom: 50px; border-radius: 10px;">
          <h1 style="margin: 0; font-size: 36px; font-weight: 700;">DOCUMENT SUMMARY</h1>
          <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.95;">AI-Generated Comprehensive Analysis</p>
          <p style="margin: 8px 0 0 0; font-size: 12px; opacity: 0.85;">Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | Time: ${new Date().toLocaleTimeString()}</p>
        </div>

        <!-- Executive Summary -->
        ${summary.executiveSummary ? `
          <div style="margin-bottom: 40px; page-break-inside: avoid;">
            <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 12px; margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">📋 Executive Summary</h2>
            <p style="color: #2c3e50; line-height: 1.8; margin: 0; font-size: 14px;">${summary.executiveSummary.replace(/\n/g, '<br>')}</p>
          </div>
        ` : ''}

        <!-- Key Points -->
        ${summary.keyPoints && cleanArray(summary.keyPoints).length > 0 ? `
          <div style="margin-bottom: 40px; page-break-inside: avoid;">
            <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 12px; margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">🎯 Key Points</h2>
            <ul style="margin: 0; padding-left: 0; list-style: none;">
              ${cleanArray(summary.keyPoints).map(point => `<li style="margin-bottom: 12px; padding-left: 25px; position: relative; color: #2c3e50; font-size: 13px;"><span style="position: absolute; left: 0; color: #667eea; font-weight: bold;">•</span>${point}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Important Terms -->
        ${summary.definitions && cleanArray(summary.definitions).length > 0 ? `
          <div style="margin-bottom: 40px; page-break-inside: avoid;">
            <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 12px; margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">📚 Important Terms</h2>
            <ul style="margin: 0; padding-left: 0; list-style: none;">
              ${cleanArray(summary.definitions).map(def => `<li style="margin-bottom: 12px; padding-left: 25px; position: relative; color: #2c3e50; font-size: 13px;"><span style="position: absolute; left: 0; color: #667eea; font-weight: bold;">•</span>${def}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Critical Insights -->
        ${summary.insights && cleanArray(summary.insights).length > 0 ? `
          <div style="margin-bottom: 40px; page-break-inside: avoid;">
            <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 12px; margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">💡 Critical Insights</h2>
            <ul style="margin: 0; padding-left: 0; list-style: none;">
              ${cleanArray(summary.insights).map(insight => `<li style="margin-bottom: 12px; padding-left: 25px; position: relative; color: #2c3e50; font-size: 13px;"><span style="position: absolute; left: 0; color: #667eea; font-weight: bold;">•</span>${insight}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Simple Explanation -->
        ${summary.easyExplanation ? `
          <div style="margin-bottom: 40px; page-break-inside: avoid;">
            <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 12px; margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">👶 Simple Explanation</h2>
            <p style="color: #2c3e50; line-height: 1.8; margin: 0; font-size: 14px;">${summary.easyExplanation.replace(/\n/g, '<br>')}</p>
          </div>
        ` : ''}

        <!-- Footer -->
        <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e0e7ff; text-align: center; color: #7c8ba3; font-size: 12px;">
          <p style="margin: 5px 0;">✨ Document Summary Generated by AI</p>
          <p style="margin: 5px 0;">For educational and reference purposes only</p>
          <p style="margin: 10px 0 0 0; font-size: 10px; opacity: 0.7;">Powered by Advanced Language Models</p>
        </div>
      </div>
    `;

    await downloadAsPDF(html, `Document_Summary_${file.name.replace('.pdf', '')}.pdf`);
  };

  // Render empty state
  if (!summary) {
    return (
      <div className="space-y-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-md"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <FiBook size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xl">PDF Summarizer</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Get AI-powered summaries of your documents instantly</p>
            </div>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-slate-800/50 transition-all"
          >
            <FiUpload size={32} className="mx-auto mb-3 text-slate-400" />
            <p className="text-slate-900 dark:text-white font-semibold mb-1">Click to upload PDF</p>
            <p className="text-slate-500 text-sm">or drag and drop (Max 50MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* File Info */}
          {file && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center gap-3 flex-1">
                <FiFile size={20} className="text-purple-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setError('');
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                <FiX size={18} className="text-slate-500" />
              </button>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2"
            >
              <FiAlertCircle size={18} className="text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSummarize}
            disabled={!file || loading}
            className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading
              ? <><FiLoader size={18} className="animate-spin" /> Analyzing PDF...</>
              : <><FiBookOpen size={18} /> Summarize PDF</>
            }
          </motion.button>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
            ✨ Powered by AI · Supports textbooks, research papers, notes & more
          </p>
        </motion.div>
      </div>
    );
  }

  // Render summary view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with Download */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-lg">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">📋 Document Summary</h2>
            <p className="text-purple-100 text-sm">{file.name}</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadSummary}
            className="flex flex-col items-center gap-2 px-6 py-4 bg-white text-purple-600 font-bold rounded-xl transition-all hover:shadow-2xl flex-shrink-0"
          >
            <FiDownload size={22} />
            <span className="text-sm">Download PDF</span>
          </motion.button>
        </div>
      </div>

      {/* Executive Summary */}
      {summary.executiveSummary && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <FiBook size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Executive Summary</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{summary.executiveSummary}</p>
        </div>
      )}

      {/* Key Points */}
      {summary.keyPoints && summary.keyPoints.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <FiList size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Key Points</h3>
          </div>
          <div className="space-y-3">
            {summary.keyPoints
              .filter(point => point.trim().length > 0)
              .slice(0, 15)
              .map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-blue-500 font-semibold text-lg leading-none mt-0.5">•</span>
                  <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{point.trim()}</span>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Important Terms */}
      {summary.definitions && summary.definitions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
              <FiBookOpen size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Important Terms</h3>
          </div>
          <div className="space-y-3">
            {summary.definitions
              .filter(def => def.trim().length > 0)
              .slice(0, 15)
              .map((def, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-green-500 font-semibold text-lg leading-none mt-0.5">•</span>
                  <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{def.trim()}</span>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Critical Insights */}
      {summary.insights && summary.insights.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
              <FiZap size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Critical Insights</h3>
          </div>
          <div className="space-y-3">
            {summary.insights
              .filter(insight => insight.trim().length > 0)
              .slice(0, 10)
              .map((insight, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-amber-500 font-semibold text-lg leading-none mt-0.5">•</span>
                  <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{insight.trim()}</span>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Easy Explanation */}
      {summary.easyExplanation && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center">
              <FiHeadphones size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Simple Explanation</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{summary.easyExplanation}</p>
        </div>
      )}

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => {
          setSummary(null);
          setFile(null);
          fileInputRef.current?.click();
        }}
        className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
      >
        ← Summarize Another Document
      </motion.button>
    </motion.div>
  );
}
