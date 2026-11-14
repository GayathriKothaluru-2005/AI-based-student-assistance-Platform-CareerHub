import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiTarget, FiZap, FiUsers, FiAward } from 'react-icons/fi';

const About = () => {
  const values = [
    {
      icon: FiZap,
      title: 'Innovation',
      description: 'We constantly innovate using cutting-edge AI technology',
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'Building a supportive ecosystem for student growth',
    },
    {
      icon: FiAward,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality tools',
    },
    {
      icon: FiBriefcase,
      title: 'Professional',
      description: 'Industry-aligned training and real-world projects',
    },
  ];

  const offers = [
    'Personalized learning experience tailored to your goals',
    'AI-powered career insights and recommendations',
    'Real-time performance tracking and analytics',
    'Industry-relevant tools used by top companies',
    'Expert mentorship and career guidance',
    'Community support and networking opportunities',
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
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
          >
            About Our Platform
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-300"
          >
            Bridging the gap between academic learning and real-world career success
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="prose prose-invert max-w-none"
          >
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Our Story</h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
              CareerHub was born from a simple observation: talented students often struggle to
              bridge the gap between academic knowledge and industry requirements. We recognized
              that technology, especially AI, could transform this journey.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
              Our mission is to democratize quality career development, making world-class tools
              and mentorship accessible to every student, regardless of their background or
              resources.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 dark:from-blue-600/10 dark:to-purple-600/10 border border-blue-200 dark:border-purple-500/20 transition-all duration-300 shadow-md group hover:shadow-xl"
            >
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="w-12 h-12 mb-4"
              >
                <FiTarget className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Our Mission</h3>
              <p className="text-lg text-slate-700 dark:text-slate-300">
                To empower students with AI-driven tools that help them learn smarter, build
                stronger profiles, and achieve their career goals efficiently.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 dark:from-cyan-600/10 dark:to-purple-600/10 border border-cyan-200 dark:border-purple-500/20 transition-all duration-300 shadow-md group hover:shadow-xl"
            >
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="w-12 h-12 mb-4"
              >
                <FiBriefcase className="w-12 h-12 text-cyan-600 dark:text-cyan-400" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Our Vision</h3>
              <p className="text-lg text-slate-700 dark:text-slate-300">
                To become a one-stop intelligent ecosystem where students can develop skills,
                track progress, and prepare for future opportunities using cutting-edge AI
                technology.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Our Core Values</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              These principles guide everything we do
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 shadow-md hover:shadow-xl group"
                >
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.15 }}
                    className="mb-4"
                  >
                    <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </motion.div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
                    {value.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              What We Offer
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Comprehensive tools and features designed for your success
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {offers.map((offer, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: 8 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0 mt-1 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p className="text-lg text-slate-700 dark:text-slate-300">{offer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
