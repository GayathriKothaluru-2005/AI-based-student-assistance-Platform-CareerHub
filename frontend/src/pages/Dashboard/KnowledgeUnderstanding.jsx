import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiFileText, FiArrowLeft } from 'react-icons/fi';
import PDFSummarizer from './PDFSummarizer';
import ToolPreviewCard from '../../components/ToolPreviewCard';

const tools = [
  {
    id: 'pdf',
    icon: FiFileText,
    title: 'PDF Summariser',
    description: 'Upload any PDF — textbook, research paper, or notes — and get an AI-generated structured summary instantly.',
    gradient: 'from-purple-500 to-pink-500',
    features: [
      'Upload PDF up to 50MB',
      'Executive summary generation',
      'Key points extraction',
      'Chapter-wise breakdown',
      'Important terms & definitions',
      'Critical insights analysis',
      'Download summary as PDF',
    ],
    badge: 'Now Available',
    accentColor: 'purple',
  },
];

export default function KnowledgeUnderstanding() {
  const [activeTool, setActiveTool] = useState(null); // null = preview, 'pdf' = pdf summarizer

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <FiBook size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Knowledge & Understanding</h1>
            <p className="text-slate-500 text-sm">Summarize documents and discover learning resources</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
            📄 PDF Analysis
          </span>
          <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-medium">
            ✨ AI-Powered
          </span>
        </div>
      </motion.div>

      {/* Tool Preview or Active Tool View */}
      {activeTool === null && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-6"
        >
          {tools.map((tool) => (
            <ToolPreviewCard
              key={tool.id}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              features={tool.features}
              gradient={tool.gradient}
              badge={tool.badge}
              accentColor={tool.accentColor}
              onUseNow={() => setActiveTool(tool.id)}
            />
          ))}
        </motion.div>
      )}

      {/* PDF Summarizer Tool */}
      {activeTool === 'pdf' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FiArrowLeft size={18} />
            Back to Tools
          </motion.button>
          <PDFSummarizer />
        </motion.div>
      )}
    </div>
  );
}
