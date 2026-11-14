import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFolderPlus, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import CSPDocumentationGenerator from './CSPDocumentationGenerator';

const projects = [
  {
    id: 'csp',
    title: 'CSP (Capstone Project)',
    desc: 'Generate professional capstone project documentation with automated templates.',
    gradient: 'from-blue-500 to-indigo-600',
    icon: '🎓',
    status: 'active',
  },
  
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1 } }),
};

export default function ProjectShowcase() {
  const [selectedTool, setSelectedTool] = useState(null);

  if (selectedTool === 'csp') {
    return (
      <div className="relative">
        <button
          onClick={() => setSelectedTool(null)}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold"
        >
          <FiArrowLeft size={16} />
          Back
        </button>
        <CSPDocumentationGenerator />
      </div>
    );
  }

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
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <FiFolderPlus size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Project Showcase</h1>
            <p className="text-slate-500 text-sm">Document and showcase your academic and professional projects</p>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onClick={() => project.status === 'active' && setSelectedTool(project.id)}
            className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all group ${
              project.status === 'active' ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
            }`}
          >
            {/* Header */}
            <div
              className={`h-32 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-noise" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl opacity-80">{project.icon}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">
                {project.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                {project.desc}
              </p>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                    project.status === 'active'
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                  }`}
                >
                  {project.status === 'active' ? 'Active' : 'Coming Soon'}
                </span>
                <FiArrowRight
                  size={16}
                  className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800 rounded-xl"
      >
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
          📋 What's Coming
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>
            ✓ <span className="font-medium">Auto-Documentation Generation</span> - AI will help generate professional documentation
          </li>
          <li>
            ✓ <span className="font-medium">Project Templates</span> - Pre-made templates for different project types
          </li>
          <li>
            ✓ <span className="font-medium">Showcase Gallery</span> - Share your projects publicly with a unique link
          </li>
          <li>
            ✓ <span className="font-medium">GitHub Integration</span> - Auto-import projects from your GitHub repositories
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
