import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiBookOpen, FiMap, FiClock, FiTarget,
  FiArrowLeft, FiCalendar
} from 'react-icons/fi';
import TimetableGenerator from './TimetableGenerator';
import RoadmapGeneratorComponent from './RoadmapGeneratorComponent';
import ToolPreviewCard from '../../components/ToolPreviewCard';

export default function LearningPlanning() {
  const [activeTool, setActiveTool] = useState(null); // null = preview, 'timetable' = timetable, 'roadmap' = roadmap

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
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <FiBookOpen size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Learning & Planning</h1>
            <p className="text-slate-500 text-sm">Plan your learning journey with AI-powered tools</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium flex items-center gap-1.5">
            <FiClock size={11} /> Study Planning
          </span>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium flex items-center gap-1.5">
            <FiTarget size={11} /> Goal-Oriented
          </span>
        </div>
      </motion.div>

      {/* Tool Selection View */}
      {activeTool === null && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Timetable Preview Card */}
          <ToolPreviewCard
            icon={FiCalendar}
            title="Study Timetable Generator"
            description="Create AI-powered daily study schedules optimized for your subjects and exam dates."
            features={[
              'Subject-based priority scheduling',
              '90-min focus blocks with breaks',
              'Exam proximity analysis',
              'Professional PDF export',
              'Cohere AI optimization'
            ]}
            gradient="from-indigo-500 to-blue-600"
            badge="Most Popular"
            accentColor="indigo"
            onUseNow={() => setActiveTool('timetable')}
          />

          {/* Roadmap Preview Card */}
          <ToolPreviewCard
            icon={FiMap}
            title="Learning Roadmap Generator"
            description="Build comprehensive learning paths tailored to your goals with AI-generated module recommendations."
            features={[
              'Beginner to Advanced levels',
              'Step-by-step modules',
              'Resource recommendations',
              'Topic-specific guidance',
              'Groq LLaMA powered'
            ]}
            gradient="from-purple-500 to-pink-600"
            badge="AI-Powered"
            accentColor="purple"
            onUseNow={() => setActiveTool('roadmap')}
          />
        </motion.div>
      )}

      {/* Timetable Tool View */}
      {activeTool === 'timetable' && (
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
          <TimetableGenerator />
        </motion.div>
      )}

      {/* Roadmap Tool View */}
      {activeTool === 'roadmap' && (
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
          <RoadmapGeneratorComponent />
        </motion.div>
      )}
    </div>
  );
}
