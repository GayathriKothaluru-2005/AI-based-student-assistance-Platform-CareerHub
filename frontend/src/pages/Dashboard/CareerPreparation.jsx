import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiFileText, FiMic, FiArrowRight, FiLayers, FiArrowLeft } from 'react-icons/fi';
import ResumeDashboard from '../ResumeBuilder/ResumeDashboard';
import JDAnalyzer from './JDAnalyzer';
import AIInterviewPrep from './AIInterviewPrep';

const tools = [
  {
    id: 'resume',
    icon: FiFileText,
    title: 'Resume Builder',
    desc: 'Build ATS-optimized resumes from scratch, parse existing resumes, or tailor them for specific job descriptions.',
    gradient: 'from-orange-500 to-amber-500',
    features: ['Create from Scratch', 'Upload & Parse', 'Job Description Matching', '4 Professional Templates'],
    tag: 'Available',
    tagColor: 'bg-green-500/10 border-green-500/20 text-green-400',
    hasComponent: true,
  },
  
  {
    id: 'interview',
    icon: FiMic,
    title: 'AI Interview Prep',
    desc: 'Upload your resume and get personalized interview questions based on your skills, projects, and experience. Practice with AI-powered real-time feedback.',
    gradient: 'from-rose-500 to-pink-500',
    features: ['Resume-based questions', 'HR & Technical Q&A', 'Project-specific questions', 'Real-time AI feedback'],
    tag: 'Available',
    tagColor: 'bg-green-500/10 border-green-500/20 text-green-400',
    hasComponent: true,
  },
  
  {
    id: 'jd-analyzer',
    icon: FiLayers,
    title: 'JD Analyzer',
    desc: 'Decode any job description instantly — extract key skills, find your skill gap, generate a personalised learning roadmap, and chat with an AI career assistant.',
    gradient: 'from-blue-500 to-indigo-600',
    features: ['Analyze JD (text or PDF)', 'Skill Gap vs your resume', 'AI Learning Roadmap', 'Career Chat Assistant'],
    tag: 'Available',
    tagColor: 'bg-green-500/10 border-green-500/20 text-green-400',
    hasComponent: true,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1 } }),
};

export default function CareerPreparation() {
  const [activeTool, setActiveTool] = useState(null);

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        {activeTool ? (
          <motion.div
            key={`tool-${activeTool}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Back button */}
            <button
              onClick={() => setActiveTool(null)}
              className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <FiArrowLeft size={18} />
              Back to Career Tools
            </button>

            {/* Render tool component inline */}
            {activeTool === 'resume' && <ResumeDashboard isEmbedded={true} onBack={() => setActiveTool(null)} />}
            {activeTool === 'interview' && <AIInterviewPrep isEmbedded={true} onBack={() => setActiveTool(null)} />}
            {activeTool === 'jd-analyzer' && <JDAnalyzer isEmbedded={true} onBack={() => setActiveTool(null)} />}
          </motion.div>
        ) : (
          <motion.div
            key="tools-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Page header */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <FiBriefcase size={22} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Career Preparation</h1>
                  <p className="text-slate-500 text-sm">Everything you need to land your dream job</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium">
                  Resume  · Interviews  · Job Descriptions
                </span>
              </div>
            </motion.div>

            {/* Tools grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tools.map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg`}
                      >
                        <Icon size={22} className="text-white" />
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wide ${tool.tagColor}`}
                      >
                        {tool.tag}
                      </span>
                    </div>

                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">{tool.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-1">{tool.desc}</p>

                    <ul className="space-y-2 mb-5">
                      {tool.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {tool.hasComponent ? (
                      <button
                        onClick={() => setActiveTool(tool.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
                      >
                        Open Tool <FiArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-sm font-medium cursor-not-allowed border border-slate-200 dark:border-slate-700"
                      >
                        Coming Soon <FiArrowRight size={14} />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
