import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiBookOpen, FiBook, FiCode, FiBriefcase, FiFolder,
  FiCpu, FiServer, FiShare2, FiMessageSquare, FiUser, FiFileText,
  FiArrowRight, FiZap, FiTrendingUp, FiAward, FiStar,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const sections = [
  {
    icon: FiBookOpen,
    label: 'Learning & Planning',
    desc: 'Generate personalized timetables and AI-powered learning roadmaps tailored to your goals.',
    path: '/dashboard/learning-planning',
    gradient: 'from-blue-500 to-cyan-500',
    tools: ['Timetable Generator', 'Roadmap Creator'],
    color: 'blue',
  },
  {
    icon: FiBook,
    label: 'Knowledge & Understanding',
    desc: 'Summarize PDFs instantly and discover curated course resources for any subject.',
    path: '/dashboard/knowledge',
    gradient: 'from-purple-500 to-pink-500',
    tools: ['PDF Summariser', 'Course Resources'],
    color: 'purple',
  },
  {
    icon: FiCode,
    label: 'Practice & Skill Building',
    desc: 'Access curated coding challenges, practice problems and skill-building resources.',
    path: '/dashboard/practice',
    gradient: 'from-green-500 to-emerald-500',
    tools: ['Coding Resources', 'Problem Sets'],
    color: 'green',
  },
  {
    icon: FiBriefcase,
    label: 'Career Preparation',
    desc: 'Build ATS-optimized resumes, score your profile, and prepare for interviews.',
    path: '/dashboard/career-prep',
    gradient: 'from-orange-500 to-amber-500',
    tools: ['Resume Builder', 'ATS Scoring', 'Interview Prep', 'Aptitude'],
    color: 'orange',
  },
  {
    icon: FiFolder,
    label: 'Project & Documentation',
    desc: 'Get AI-powered project ideas matched to your skills, and auto-generate documentation.',
    path: '/dashboard/projects',
    gradient: 'from-pink-500 to-rose-500',
    tools: ['Project Ideas', 'Doc Generator'],
    color: 'pink',
  },
  {
    icon: FiServer,
    label: 'IT & Non-IT Company Exams',
    desc: 'Company-specific exam resources for all top IT and Non-IT organizations.',
    path: '/dashboard/company-exams',
    gradient: 'from-red-500 to-orange-400',
    tools: ['IT Companies', 'Non-IT Companies', 'PSU'],
    color: 'red',
  },
  {
    icon: FiCpu,
    label: 'GATE Resources',
    desc: 'Subject-wise GATE preparation material, previous papers and mock tests.',
    path: '/dashboard/gate-resources',
    gradient: 'from-violet-500 to-purple-600',
    tools: ['Subject Notes', 'Previous Papers', 'Mock Tests'],
    color: 'violet',
  },
  {
    icon: FiShare2,
    label: 'Social Media Optimisation',
    desc: 'Optimize your Naukri and LinkedIn profiles with tips to attract recruiters.',
    path: '/dashboard/social-media',
    gradient: 'from-sky-500 to-blue-500',
    tools: ['Naukri Tips', 'LinkedIn Tips'],
    color: 'sky',
  },
  {
    icon: FiMessageSquare,
    label: 'Career Guidance',
    desc: 'Chat with an AI career advisor to get personalized guidance and answers.',
    path: '/dashboard/career-guidance',
    gradient: 'from-teal-500 to-cyan-500',
    tools: ['AI Chatbot', 'Career QnA'],
    color: 'teal',
  },
  {
    icon: FiFileText,
    label: 'JD Analyzer',
    desc: 'Analyze job descriptions, identify skill gaps, and generate a personalized learning roadmap.',
    path: '/dashboard/jd-analyzer',
    gradient: 'from-blue-500 to-indigo-600',
    tools: ['Analyze JD', 'Skill Gap', 'Roadmap'],
    color: 'indigo',
  },
  {
    icon: FiUser,
    label: 'Profile',
    desc: 'Manage your personal and academic details to personalize your experience.',
    path: '/dashboard/profile',
    gradient: 'from-slate-400 to-slate-600',
    tools: ['Personal Info', 'Academic Details'],
    color: 'slate',
  },
];

const stats = [
  { icon: FiZap, label: 'AI Tools', value: '12+', gradient: 'from-blue-500 to-cyan-500' },
  { icon: FiTrendingUp, label: 'Learning Paths', value: '50+', gradient: 'from-purple-500 to-pink-500' },
  { icon: FiAward, label: 'Resources', value: '200+', gradient: 'from-orange-500 to-amber-500' },
  { icon: FiStar, label: 'Companies', value: '100+', gradient: 'from-green-500 to-emerald-500' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-px"
      >
        <div className="rounded-2xl bg-white dark:bg-slate-900 px-6 py-7 md:px-10 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
                Your AI-powered student assistance platform. Choose a tool below to get started.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs font-medium">
                🎯 All Tools Available
              </span>
              <span className="px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-xs font-medium">
                ✓ Account Active
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center flex-shrink-0`}
              >
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white text-xl font-bold leading-none">{stat.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* All sections */}
      <div className="mb-4">
        <h2 className="text-slate-900 dark:text-white font-bold text-lg mb-1">All AI Services</h2>
        <p className="text-slate-500 text-sm">Select a section to explore its tools and resources.</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div key={section.path} variants={cardVariants}>
              <Link
                to={section.path}
                className="group flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-200"
              >
                {/* icon */}
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon size={20} className="text-white" />
                </div>

                {/* label */}
                <h3 className="text-slate-900 dark:text-white font-semibold text-sm leading-snug mb-1.5">
                  {section.label}
                </h3>

                {/* desc */}
                <p className="text-slate-500 text-xs leading-relaxed flex-1 mb-4">
                  {section.desc}
                </p>

                {/* tool chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {section.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] border border-slate-200 dark:border-slate-700/60 group-hover:border-slate-300 dark:group-hover:border-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-white transition-colors">
                  Explore
                  <FiArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
