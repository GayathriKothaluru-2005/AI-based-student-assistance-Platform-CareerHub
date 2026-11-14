import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiTerminal, FiLayers, FiZap, FiArrowRight, FiExternalLink, FiChevronDown, FiBook } from 'react-icons/fi';

const topicCategories = [
  {
    title: 'Data Structures & Algorithms',
    icon: FiLayers,
    color: 'from-green-500 to-emerald-600',
    resources: [
      { name: 'LeetCode DSA Problems (200+)', link: 'https://leetcode.com/explore/interview/card/top-interview-questions/', type: 'Practice' },
      { name: 'LeetCode Top Companies (150+)', link: 'https://leetcode.com/problem-list/top-interview-questions/', type: 'Practice' },
      { name: 'HackerRank DSA Practice Problems', link: 'https://www.hackerrank.com/domains/tutorials/10-days-of-javascript', type: 'Tutorial' },
      { name: 'CodeChef DSA Problems', link: 'https://www.codechef.com/certification/data-structures-algorithms/practice', type: 'Practice' },
      { name: 'GeeksforGeeks DSA Complete (500+)', link: 'https://www.geeksforgeeks.org/data-structures/', type: 'Tutorial' },
      { name: 'InterviewBit DSA (200+ Problems)', link: 'https://www.interviewbit.com/coding-problems/topic/arrays/', type: 'Practice' },
    ]
  },
  {
    title: 'Web Development',
    icon: FiCode,
    color: 'from-cyan-500 to-blue-600',
    resources: [
      { name: 'W3Schools - HTML5', link: 'https://www.w3schools.com/html/', type: 'Tutorial' },
      { name: 'W3Schools - CSS3', link: 'https://www.w3schools.com/css/', type: 'Tutorial' },
      { name: 'W3Schools - JavaScript ES6', link: 'https://www.w3schools.com/js/', type: 'Tutorial' },
      { name: 'W3Schools - React', link: 'https://www.w3schools.com/react/', type: 'Tutorial' },
      { name: 'MDN Web Docs - JavaScript', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', type: 'Reference' },
      { name: 'FreeCodeCamp - React Course', link: 'https://www.freecodecamp.org/news/tag/react/', type: 'Course' },
    ]
  },
  {
    title: 'Database & SQL',
    icon: FiBook,
    color: 'from-blue-500 to-indigo-600',
    resources: [
      { name: 'W3Schools - SQL Basics', link: 'https://www.w3schools.com/sql/', type: 'Tutorial' },
      { name: 'W3Schools - MySQL', link: 'https://www.w3schools.com/mysql/', type: 'Tutorial' },
      { name: 'W3Schools - PostgreSQL', link: 'https://www.w3schools.com/postgresql/', type: 'Tutorial' },
      { name: 'W3Schools - MongoDB', link: 'https://www.w3schools.com/mongodb/', type: 'Tutorial' },
      { name: 'LeetCode Database Problems', link: 'https://leetcode.com/problemset/database/', type: 'Practice' },
      { name: 'GeeksforGeeks DBMS', link: 'https://www.geeksforgeeks.org/dbms/', type: 'Tutorial' },
    ]
  },
  {
    title: 'System Design',
    icon: FiLayers,
    color: 'from-purple-500 to-pink-600',
    resources: [
      { name: 'Grokking System Design Interview', link: 'https://www.educative.io/courses/grokking-the-system-design-interview', type: 'Course' },
      { name: 'System Design Interview Resources', link: 'https://github.com/donnemartin/system-design-primer', type: 'Guide' },
      { name: 'YouTube - Gaurav Sen System Design', link: 'https://www.youtube.com/playlist?list=PLMCXHnjXnTuC-xGaFXWVYcLMbEHBW6p3N', type: 'Video' },
      { name: 'InterviewBit System Design', link: 'https://www.interviewbit.com/courses/system-design/', type: 'Tutorial' },
      { name: 'GeeksforGeeks System Design', link: 'https://www.geeksforgeeks.org/design-patterns-in-java/', type: 'Tutorial' },
      { name: 'LeetCode HLD & LLD Problems', link: 'https://leetcode.com/discuss/interview-question/system-design', type: 'Practice' },
    ]
  },
  {
    title: 'OOP & Design Patterns',
    icon: FiTerminal,
    color: 'from-orange-500 to-red-600',
    resources: [
      { name: 'W3Schools - Java OOP', link: 'https://www.w3schools.com/java/java_oop.asp', type: 'Tutorial' },
      { name: 'W3Schools - Python OOP', link: 'https://www.w3schools.com/python/python_classes.asp', type: 'Tutorial' },
      { name: 'W3Schools - C++ OOP', link: 'https://www.w3schools.com/cpp/cpp_oop.asp', type: 'Tutorial' },
      { name: 'Refactoring Guru - Design Patterns', link: 'https://refactoring.guru/design-patterns', type: 'Reference' },
      { name: 'GeeksforGeeks OOP Concepts', link: 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/', type: 'Tutorial' },
      { name: 'YouTube - OOP Concepts (Programming)', link: 'https://www.youtube.com/results?search_query=object+oriented+programming', type: 'Video' },
    ]
  },
  {
    title: 'Programming Languages',
    icon: FiCode,
    color: 'from-yellow-500 to-orange-600',
    resources: [
      { name: 'W3Schools - Java Complete', link: 'https://www.w3schools.com/java/', type: 'Tutorial' },
      { name: 'W3Schools - Python Complete', link: 'https://www.w3schools.com/python/', type: 'Tutorial' },
      { name: 'W3Schools - C Programming', link: 'https://www.w3schools.com/c/', type: 'Tutorial' },
      { name: 'W3Schools - C++ Complete', link: 'https://www.w3schools.com/cpp/', type: 'Tutorial' },
      { name: 'LeetCode Java Problems', link: 'https://leetcode.com/problemset/all/?language=java', type: 'Practice' },
      { name: 'LeetCode Python Problems', link: 'https://leetcode.com/problemset/all/?language=python3', type: 'Practice' },
    ]
  },
  {
    title: 'OS & Networking',
    icon: FiZap,
    color: 'from-pink-500 to-rose-600',
    resources: [
      { name: 'GeeksforGeeks Operating System', link: 'https://www.geeksforgeeks.org/operating-systems/', type: 'Tutorial' },
      { name: 'GeeksforGeeks Computer Networks', link: 'https://www.geeksforgeeks.org/computer-networks/', type: 'Tutorial' },
      { name: 'YouTube - Operating System Playlist', link: 'https://www.youtube.com/results?search_query=operating+system+tutorial', type: 'Video' },
      { name: 'YouTube - Networking Fundamentals', link: 'https://www.youtube.com/results?search_query=computer+networking', type: 'Video' },
      { name: 'Baeldung - Java Network Programming', link: 'https://www.baeldung.com/java-networking', type: 'Tutorial' },
      { name: 'InterviewBit OS & Networking', link: 'https://www.interviewbit.com/os-interview-questions/', type: 'QA' },
    ]
  },
];

const platforms = [
  { name: 'LeetCode', desc: '200+ DSA Problems', color: 'from-orange-500 to-amber-500', link: 'https://leetcode.com' },
  { name: 'HackerRank', desc: 'Skill Challenges', color: 'from-green-500 to-emerald-500', link: 'https://www.hackerrank.com' },
  { name: 'CodeChef', desc: 'Competitive Prog', color: 'from-amber-500 to-orange-400', link: 'https://www.codechef.com' },
  { name: 'Codeforces', desc: 'CP Contests', color: 'from-blue-500 to-indigo-500', link: 'https://codeforces.com' },
  { name: 'GeeksforGeeks', desc: 'CS Theory+Practice', color: 'from-green-600 to-teal-500', link: 'https://www.geeksforgeeks.org' },
  { name: 'InterviewBit', desc: 'Interview Prep', color: 'from-cyan-500 to-blue-500', link: 'https://www.interviewbit.com' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
};

function ResourceCard({ title, resources, icon: Icon, color }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all"
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 bg-gradient-to-r from-slate-50 dark:from-slate-800 to-slate-100 dark:to-slate-800 cursor-pointer flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{title}</h3>
            <p className="text-xs text-slate-500">{resources.length} Resources</p>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
          <FiChevronDown size={16} className="text-slate-400" />
        </motion.div>
      </div>

      {/* Resources List */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-3 space-y-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {resources.map((resource, idx) => (
            <a
              key={idx}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition">
                  {resource.name}
                </p>
                <span className="text-[10px] px-2 py-0.5 rounded full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 inline-block mt-0.5">
                  {resource.type}
                </span>
              </div>
              <FiExternalLink size={14} className="text-slate-400 group-hover:text-blue-500 transition flex-shrink-0 ml-2" />
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PracticeSkillBuilding() {
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
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <FiCode size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Practice & Skill Building</h1>
            <p className="text-slate-500 text-sm">200+ DSA problems, web development, databases, system design & more</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium flex items-center gap-1.5">
            <FiTerminal size={11} /> 200+ DSA Problems
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5">
            <FiLayers size={11} /> 7 Topics
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium flex items-center gap-1.5">
            <FiBook size={11} /> Free Resources
          </span>
        </div>
      </motion.div>

      {/* Topic Categories with Resources */}
      <div className="mb-10">
        <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-2">Comprehensive Learning Resources</h2>
        <p className="text-slate-500 text-sm mb-5">Click on any topic to expand and view all resources</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {topicCategories.map((topic) => (
            <ResourceCard
              key={topic.title}
              title={topic.title}
              resources={topic.resources}
              icon={topic.icon}
              color={topic.color}
            />
          ))}
        </div>
      </div>

      {/* Recommended Platforms */}
      <div>
        <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-1">Top Coding Platforms</h2>
        <p className="text-slate-500 text-sm mb-5">Platforms with 200+ practice problems and contests</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {platforms.map((platform, i) => (
            <motion.a
              key={platform.name}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <FiZap size={16} className="text-white" />
              </div>
              <p className="text-slate-900 dark:text-white font-semibold text-sm mb-1">{platform.name}</p>
              <p className="text-slate-500 text-xs mb-3">{platform.desc}</p>
              <div className="flex items-center gap-1 text-blue-500 font-medium text-xs group-hover:gap-2 transition-all">
                Visit <FiArrowRight size={12} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Pro Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 p-6 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border border-violet-200 dark:border-violet-800 rounded-xl"
      >
        <h3 className="font-semibold text-violet-900 dark:text-violet-300 mb-3">💡 Pro Tips for Effective Practice</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-violet-800 dark:text-violet-200">
          <li>✓ Start with easy problems then move to medium/hard</li>
          <li>✓ Practice DSA daily - consistency is key</li>
          <li>✓ Learn W3Schools basics before advanced concepts</li>
          <li>✓ Build projects to solidify web dev skills</li>
          <li>✓ Participate in coding contests for experience</li>
          <li>✓ Read solutions of others to learn different approaches</li>
        </ul>
      </motion.div>
    </div>
  );
}
