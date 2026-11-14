import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiEdit3,
  FiUpload,
  FiTarget,
  FiFileText,
  FiZap,
  FiArrowRight,
  FiClock,
  FiPlus,
  FiTrash2,
  FiDownload,
  FiMoreVertical,
  FiStar,
} from 'react-icons/fi';

const modes = [
  {
    id: 'manual',
    icon: FiEdit3,
    emoji: '✍️',
    title: 'Create from Scratch',
    description: 'Build a professional resume manually with guided sections and beautiful templates.',
    cta: 'Start Building',
    gradient: 'from-blue-500 to-blue-700',
    glowColor: 'blue',
    badge: 'Most Popular',
    features: ['Guided step-by-step', 'Live preview', '4 Templates'],
    path: '/resume-builder/manual',
  },
  {
    id: 'parse',
    icon: FiUpload,
    emoji: '📄',
    title: 'Upload Existing Resume',
    description: 'Upload your resume and let AI extract, structure, and enhance your data automatically.',
    cta: 'Upload Resume',
    gradient: 'from-purple-500 to-purple-700',
    glowColor: 'purple',
    badge: 'AI Powered',
    features: ['PDF / DOC support', 'Smart extraction', 'Auto-fill form'],
    path: '/resume-builder/parse',
  },
  {
    id: 'optimize',
    icon: FiTarget,
    emoji: '🎯',
    title: 'Optimize for Job',
    description: 'Upload your resume + job description to generate an ATS-optimized, tailored resume.',
    cta: 'Optimize Now',
    gradient: 'from-cyan-500 to-cyan-700',
    glowColor: 'cyan',
    badge: 'Best Results',
    features: ['ATS Score boost', 'Keyword matching', 'JD analysis'],
    path: '/resume-builder/optimize',
  },
];

const savedResumes = [
  { id: 1, name: 'Google SWE Resume', template: 'Professional', lastEdited: '2 hours ago', score: 92 },
  { id: 2, name: 'Amazon Backend Role', template: 'Minimal ATS', lastEdited: 'Yesterday', score: 87 },
  { id: 3, name: 'Startup Frontend Dev', template: 'Modern Sidebar', lastEdited: '3 days ago', score: 78 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function ResumeDashboard({ isEmbedded = false, onBack = null }) {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleNavigate = (path) => {
    if (isEmbedded) {
      // In embedded mode, you could handle navigation differently if needed
      // For now, we'll navigate within the embedded context
      navigate(path);
    } else {
      navigate(path);
    }
  };

  const containerClass = isEmbedded
    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
    : 'min-h-screen bg-slate-950 text-white';

  const isFullScreen = !isEmbedded;

  return (
    <div className={`${containerClass} relative overflow-hidden ${isFullScreen ? '' : 'p-6 rounded-lg'}`}>
      {/* Animated background orbs - only in full screen mode */}
      {isFullScreen && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl"
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
          >
            <FiZap className="w-4 h-4" />
            AI Career Optimization Platform
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
            Build Your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Perfect Resume
            </span>{' '}
            with AI
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Create, optimize, and customize resumes for any job using intelligent automation.
            Land your dream job with AI-powered insights.
          </p>
        </motion.div>

        {/* Mode selection cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isHovered = hoveredCard === mode.id;
            return (
              <motion.div
                key={mode.id}
                variants={itemVariants}
                onHoverStart={() => setHoveredCard(mode.id)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ y: -8, scale: 1.01 }}
                onClick={() => handleNavigate(mode.path)}
                className="relative group cursor-pointer"
              >
                {/* Glow effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-br ${mode.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300`}
                />

                <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 group-hover:border-slate-500/70 p-8 h-full flex flex-col transition-all duration-300 shadow-xl group-hover:shadow-2xl overflow-hidden">
                  {/* Background shimmer */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  {/* Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <motion.div
                      animate={isHovered ? { rotate: [0, -10, 10, 0], scale: 1.15 } : { rotate: 0, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mode.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${mode.gradient} text-white`}
                    >
                      {mode.badge}
                    </span>
                  </div>

                  <div className="text-2xl mb-1">{mode.emoji}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{mode.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                    {mode.description}
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {mode.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300"
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-3 rounded-xl bg-gradient-to-r ${mode.gradient} text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow`}
                  >
                    {mode.cta}
                    <motion.span
                      animate={isHovered ? { x: [0, 5, 0] } : { x: 0 }}
                      transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
                    >
                      <FiArrowRight className="w-4 h-4" />
                    </motion.span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Saved Resumes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">My Resumes</h2>
              <p className="text-slate-400 text-sm mt-1">Manage and access your saved resume versions</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigate('/resume-builder/manual')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              New Resume
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savedResumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group p-5 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-blue-500/40 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        resume.score >= 90
                          ? 'bg-green-500/20 text-green-400'
                          : resume.score >= 80
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {resume.score}%
                    </div>
                    <button className="p-1 text-slate-500 hover:text-slate-300 transition-colors">
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                  {resume.name}
                </h3>
                <p className="text-xs text-slate-500 mb-4">{resume.template} Template</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <FiClock className="w-3 h-3" />
                    {resume.lastEdited}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-slate-400 hover:text-blue-400 transition-colors">
                      <FiDownload className="w-4 h-4" />
                    </button>
                    <button className="text-slate-400 hover:text-red-400 transition-colors">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add new card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ y: -4 }}
              onClick={() => handleNavigate('/resume-builder/manual')}
              className="group p-5 rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[140px] gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800 group-hover:bg-blue-500/10 border border-slate-700 group-hover:border-blue-500/30 flex items-center justify-center transition-all">
                <FiPlus className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <p className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors font-medium">
                Create New Resume
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Resumes Created', value: '3', icon: FiFileText },
            { label: 'Avg. ATS Score', value: '85%', icon: FiStar },
            { label: 'Downloads', value: '12', icon: FiDownload },
            { label: 'Templates Used', value: '3', icon: FiZap },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center"
              >
                <Icon className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
