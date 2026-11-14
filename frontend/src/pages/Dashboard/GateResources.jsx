import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCpu, FiBook, FiClipboard, FiBarChart2, FiArrowRight, FiCode, FiExternalLink, FiChevronDown } from 'react-icons/fi';

const subjects = [
  { label: 'Engineering Mathematics', code: 'MATH', color: 'from-blue-500 to-cyan-500' },
  { label: 'General Aptitude', code: 'GA', color: 'from-green-500 to-emerald-500' },
  { label: 'Computer Science & IT', code: 'CS/IT', color: 'from-purple-500 to-violet-500' },
  { label: 'Electronics & Communication', code: 'ECE', color: 'from-orange-500 to-amber-500' },
  { label: 'Electrical Engineering', code: 'EE', color: 'from-yellow-500 to-orange-500' },
  { label: 'Mechanical Engineering', code: 'ME', color: 'from-red-500 to-rose-500' },
];

const freeResources = [
  {
    category: 'Free NCERT Books',
    icon: FiBook,
    gradient: 'from-emerald-500 to-teal-600',
    items: [
      { name: 'NCERT Mathematics XI-XII', link: 'https://ncert.nic.in/textbook.php', type: 'Official' },
      { name: 'NCERT Physics XI-XII', link: 'https://ncert.nic.in/textbook.php', type: 'Official' },
      { name: 'NCERT Chemistry XI-XII', link: 'https://ncert.nic.in/textbook.php', type: 'Official' },
    ]
  },
  {
    category: 'YouTube Channels',
    icon: FiCode,
    gradient: 'from-red-500 to-pink-600',
    items: [
      { name: 'BYJU\'s GATE Preparation', link: 'https://youtube.com/@byjusgatechannel', type: 'Video' },
      { name: 'TechnoStudy - GATE CSE', link: 'https://youtube.com/@technostudyforcsegate', type: 'Video' },
      { name: 'Gate Smashers', link: 'https://youtube.com/@gatesmashers', type: 'Video' },
      { name: 'ACE GATE Academy', link: 'https://youtube.com/@aceacademy', type: 'Video' },
    ]
  },
  {
    category: 'Open Educational Resources',
    icon: FiClipboard,
    gradient: 'from-violet-500 to-purple-600',
    items: [
      { name: 'MIT OpenCourseWare', link: 'https://ocw.mit.edu/', type: 'Course' },
      { name: 'Khan Academy - Engineering', link: 'https://www.khanacademy.org/', type: 'Course' },
      { name: 'NPTEL - IIT Video Lectures', link: 'https://nptel.ac.in/', type: 'Course' },
      { name: 'Brilliant.org - Problem Solving', link: 'https://brilliant.org/', type: 'Interactive' },
    ]
  },
  {
    category: 'Previous Year Papers & Mock Tests',
    icon: FiBarChart2,
    gradient: 'from-blue-500 to-indigo-600',
    items: [
      { name: 'Official GATE Papers (Upto 2023)', link: 'https://gate.iitb.ac.in/', type: 'Papers' },
      { name: 'Made Easy Mock Tests', link: 'https://www.madeeasy.in/', type: 'Mock' },
      { name: 'Gateoverflow - PYQ Solutions', link: 'https://gateoverflow.in/', type: 'Solutions' },
      { name: 'All India Tests Platform', link: 'https://www.indiabix.com/gate/', type: 'Practice' },
    ]
  },
  {
    category: 'Competitive Exam Platforms',
    icon: FiBook,
    gradient: 'from-orange-500 to-rose-600',
    items: [
      { name: 'GeeksforGeeks - GATE Prep', link: 'https://www.geeksforgeeks.org/gate-computer-science-questions-answers/', type: 'QA' },
      { name: 'Sanfoundry GATE Tests', link: 'https://www.sanfoundry.com/', type: 'Tests' },
      { name: 'Testbook Free Tests', link: 'https://testbook.com/', type: 'Mock' },
      { name: 'IndiaBIX - GATE Questions', link: 'https://www.indiabix.com/', type: 'QA' },
    ]
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
};

function ResourceCard({ category, items, icon: Icon, gradient }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all"
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-5 bg-gradient-to-r from-slate-50 dark:from-slate-800 to-slate-100 dark:to-slate-800 cursor-pointer flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Icon size={18} className="text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{category}</h3>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
          <FiChevronDown size={18} className="text-slate-400" />
        </motion.div>
      </div>

      {/* Items */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 space-y-2 border-t border-slate-200 dark:border-slate-800">
          {items.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all group"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition">
                  {item.name}
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 inline-block mt-1">
                  {item.type}
                </span>
              </div>
              <FiExternalLink size={16} className="text-slate-400 group-hover:text-blue-500 transition flex-shrink-0 ml-2" />
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GateResources() {
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
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <FiCpu size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">GATE Resources</h1>
            <p className="text-slate-500 text-sm">Free & legitimate preparation materials from official sources</p>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 dark:text-green-400 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          ✓ All resources are free and from official sources
        </div>
      </motion.div>

      {/* Subjects */}
      <div className="mb-8">
        <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-1">Subjects Covered</h2>
        <p className="text-slate-500 text-sm mb-4">Resources available for all major GATE streams</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map((sub, i) => (
            <motion.div
              key={sub.code}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all group cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sub.color} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-white text-[10px] font-bold">{sub.code}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {sub.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured: CS/IT Detailed Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 border border-purple-200 dark:border-purple-800 rounded-2xl p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <FiCode size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">⭐ GATE CS/IT Complete Guide</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Comprehensive, exam-focused preparation guide covering syllabus, resources, toppers' strategies, and 25-year PYQ analysis.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-purple-200 dark:bg-purple-800/40 text-purple-900 dark:text-purple-300 font-medium">✓ Syllabus Breakdown</span>
              <span className="text-xs px-3 py-1 rounded-full bg-purple-200 dark:bg-purple-800/40 text-purple-900 dark:text-purple-300 font-medium">✓ Best Resources</span>
              <span className="text-xs px-3 py-1 rounded-full bg-purple-200 dark:bg-purple-800/40 text-purple-900 dark:text-purple-300 font-medium">✓ Preparation Roadmap</span>
              <span className="text-xs px-3 py-1 rounded-full bg-purple-200 dark:bg-purple-800/40 text-purple-900 dark:text-purple-300 font-medium">✓ Pro Tips</span>
            </div>
          </div>
          <Link
            to="/dashboard/gate-cs-guide"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-semibold hover:from-purple-600 hover:to-violet-700 transition-all whitespace-nowrap flex-shrink-0"
          >
            View Guide <FiArrowRight size={14} />
          </Link>
        </div>
      </motion.div>

      {/* Free Resources */}
      <div>
        <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-2">Free Learning Resources</h2>
        <p className="text-slate-500 text-sm mb-5">Click on any category to expand and view all resources</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {freeResources.map((resource) => (
            <ResourceCard
              key={resource.category}
              category={resource.category}
              items={resource.items}
              icon={resource.icon}
              gradient={resource.gradient}
            />
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl"
      >
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">📝 Pro Tips for GATE Preparation</h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>✓ Start with NCERT books for strong fundamentals</li>
          <li>✓ Watch YouTube lectures for concepts you find difficult</li>
          <li>✓ Practice previous year papers to understand exam pattern</li>
          <li>✓ Use Gateoverflow for doubts and detailed solutions</li>
          <li>✓ Take regular mock tests to improve time management</li>
          <li>✓ All resources here are FREE and from official/reputable sources - no piracy</li>
        </ul>
      </motion.div>
    </div>
  );
}
