import React from 'react';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiMap,
  FiFileText,
  FiBriefcase,
  FiCheckSquare,
  FiHelpCircle,
  FiVideo,
  FiCode,
  FiAward,
  FiBook,
  FiTrendingUp,
  FiLinkedin,
  FiBarChart2,
} from 'react-icons/fi';

const Services = () => {
  const services = [
    {
      icon: FiCalendar,
      title: 'AI Timetable Generator',
      description: 'Create personalized study schedules based on your goals and available time',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: FiMap,
      title: 'Tech Roadmap Generator',
      description: 'Custom learning paths for any technology or skill you want to master',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: FiFileText,
      title: 'PDF Summarizer & Chat',
      description: 'Extract insights from documents with AI-powered summarization and Q&A',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: FiBriefcase,
      title: 'Resume Builder',
      description: 'Build professional, ATS-optimized resumes with AI suggestions',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: FiCheckSquare,
      title: 'Resume Analyzer',
      description: 'Get detailed feedback on your resume to improve your chances',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: FiHelpCircle,
      title: 'Interview Question Generator',
      description: 'Practice with AI-generated interview questions for any role',
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: FiVideo,
      title: 'AI Video Interview',
      description: 'Record mock interviews and get AI evaluation with detailed feedback',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: FiCode,
      title: 'Coding Practice Platform',
      description: 'Solve coding challenges with AI hints and real-time code analysis',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: FiAward,
      title: 'Quiz & Leaderboard',
      description: 'Test your knowledge with interactive quizzes and compete globally',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: FiBook,
      title: 'Project Documentation',
      description: 'Auto-generate professional documentation for your projects',
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: FiTrendingUp,
      title: 'Career Guidance AI',
      description: 'Get personalized career advice and path recommendations',
      color: 'from-violet-500 to-violet-600',
    },
    {
      icon: FiLinkedin,
      title: 'LinkedIn Optimization',
      description: 'Optimize your LinkedIn profile to attract recruiters',
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: FiBarChart2,
      title: 'Performance Dashboard',
      description: 'Track your progress with detailed analytics and insights',
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
          >
            Our AI-Powered Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-300"
          >
            13 comprehensive tools designed to accelerate your career growth
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="group relative rounded-2xl overflow-hidden"
                >
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 dark:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300 -z-10`}
                  />

                  {/* Card content */}
                  <div className="p-8 rounded-2xl bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 group-hover:border-purple-500/50 dark:group-hover:border-purple-500/50 transition-all duration-300 shadow-md group-hover:shadow-xl h-full flex flex-col">
                    {/* Icon with pulse animation */}
                    <div className="relative mb-6">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-xl opacity-0 group-hover:opacity-20`}
                      />
                      <motion.div
                        whileHover={{ rotate: 12, scale: 1.15 }}
                        className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:shadow-lg transition-shadow`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                    </div>

                    {/* Title and description */}
                    <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow">
                      {service.description}
                    </p>

                    {/* Student-focused badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span>✨ Essential Tool</span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Why These Services?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Each service is carefully designed to solve real challenges students face
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Save Time',
                description: 'Automate repetitive tasks and focus on what matters',
              },
              {
                title: 'Get Better Results',
                description: 'AI-powered insights help you make smarter decisions',
              },
              {
                title: 'Stay Competitive',
                description: 'Access tools used by top companies and professionals',
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-center"
              >
                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-6 text-slate-900 dark:text-white"
          >
            Ready to get started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 mb-8"
          >
            Start using all these tools today and transform your career journey
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
          >
            Explore All Services
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default Services;
