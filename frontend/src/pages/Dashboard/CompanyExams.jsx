import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiServer, FiMonitor,  FiBox, FiChevronDown, FiExternalLink, FiCheck, FiClock } from 'react-icons/fi';

const itCompanies = [
  {
    name: 'TCS',
    logo: '🔷',
    color: 'from-blue-600 to-blue-700',
    exam: 'TCS NQT Exam',
    rounds: [
      { name: 'Online Assessment', duration: '90 mins', details: '30 MCQs (Aptitude, Reasoning), 1 Coding Problem (1-1.5 hrs)' },
      { name: 'Group Discussion', duration: '15-20 mins', details: 'Topic given based on your profile, eliminating round' },
      { name: 'Technical Interview', duration: '30-40 mins', details: 'DSA, DBMS, OS, Networking, Project Discussion' },
      { name: 'HR Interview', duration: '20-30 mins', details: 'Personal intro, motivation, compensation, notice period' },
    ],
    cutoff: { aptitude: '70%', coding: '1/2 problems', gated: 'Yes - Higher marks required' },
    resources: [
      { name: 'TCS Official Website', link: 'https://www.tcs.com/careers' },
      { name: 'TCS NQT Previous Papers (HackerEarth)', link: 'https://www.hackerearth.com/' },
      { name: 'GeeksforGeeks TCS Interview', link: 'https://www.geeksforgeeks.org/tcs-placement-paper/' },
    ],
    tips: [
      'Practice at least 50+ coding problems',
      'Prepare for aptitude: Time & Distance, Permutation & Combination, Simple Interest',
      'Be ready for data structures deep dive',
      'Have concrete examples for each project',
    ]
  },
  {
    name: 'Infosys',
    logo: '🔵',
    color: 'from-indigo-600 to-indigo-700',
    exam: 'Infosys Foundational Exam',
    rounds: [
      { name: 'Online Test', duration: '120 mins', details: '1 Coding + 1 MCQ (English, Logic, Aptitude)' },
      { name: 'Technical Interview', duration: '45-60 mins', details: 'Core Java/C++, SQL, Project explanation, DSA basics' },
      { name: 'HR Round', duration: '20-30 mins', details: 'Behavioral, background verification, expectations' },
    ],
    cutoff: { aptitude: '60%', coding: 'Partial/Full', other: 'Technical round clearing is mandatory' },
    resources: [
      { name: 'Infosys Official', link: 'https://www.infosysplacement.com/' },
      { name: 'Infosys Interview Experiences', link: 'https://www.geeksforgeeks.org/infosys-interview-experience/' },
      { name: 'InterviewBit Infosys DSA', link: 'https://www.interviewbit.com/coding-problems/' },
    ],
    tips: [
      'Java is preferred language - master Collections, Streams, Exception Handling',
      'SQL queries are must - JOIN, Subqueries, Indexing',
      'Projects should be deployment-ready',
      'Be ready to justify every line of code you write',
    ]
  },
  {
    name: 'Wipro',
    logo: '🟣',
    color: 'from-purple-600 to-purple-700',
    exam: 'Wipro ELITE/PRIME',
    rounds: [
      { name: 'Online Assessment', duration: '120 mins', details: '2-3 Coding + 1 MCQ section' },
      { name: 'Technical Interview 1', duration: '45 mins', details: 'DSA, Code debugging, Technical fundamentals' },
      { name: 'Technical Interview 2', duration: '45 mins', details: 'Project deep dive, System design basics' },
      { name: 'HR Round', duration: '20 mins', details: 'Cultural fit, salary negotiation' },
    ],
    cutoff: { coding: 'Atleast 2/3 problems', aptitude: '65%', other: 'Tier based on round performance' },
    resources: [
      { name: 'Wipro Careers', link: 'https://careers.wipro.com/campus' },
      { name: 'Wipro Interview Questions', link: 'https://www.geeksforgeeks.org/wipro/' },
      { name: 'LeetCode Wipro Company Tag', link: 'https://leetcode.com/discuss/interview-question' },
    ],
    tips: [
      'Medium to Hard DSA questions are common',
      'Prepare for code tracing and debugging',
      'Full stack knowledge appreciated',
      'Be clear on architecture of your projects',
    ]
  },
  {
    name: 'Accenture',
    logo: '🔶',
    color: 'from-violet-600 to-violet-700',
    exam: 'Accenture Campus Drive',
    rounds: [
      { name: 'Online Test', duration: '120 mins', details: '1-2 Coding + Aptitude (2 hrs total)' },
      { name: 'Technical Interview', duration: '40-50 mins', details: 'Problem solving, debugging, fundamentals, project' },
      { name: 'Managerial Round', duration: '20-30 mins', details: 'Communication, leadership, team skills' },
    ],
    cutoff: { coding: 'Any 1 full', aptitude: '60%', gated: 'Partial marks accepted' },
    resources: [
      { name: 'Accenture Careers Portal', link: 'https://www.accenture.com/us-en/careers' },
      { name: 'Accenture Interview Guide', link: 'https://www.geeksforgeeks.org/accenture/' },
    ],
    tips: [
      'Mix of Easy to Medium problems',
      'Focus on problem-solving approach, not just code',
      'Communication is key - explain clearly',
      'Accenture likes practical implementation experience',
    ]
  },
  {
    name: 'Cognizant',
    logo: '🔷',
    color: 'from-blue-500 to-cyan-600',
    exam: 'Cognizant Genext/GenC',
    rounds: [
      { name: 'Online Assessment', duration: '180 mins', details: '4 Coding problems (Medium to Hard level)' },
      { name: 'Technical Interview', duration: '45 mins', details: 'DSA optimization, DBMS, System concepts' },
      { name: 'HR Interview', duration: '20 mins', details: 'Background check, expectations alignment' },
    ],
    cutoff: { coding: 'Atleast 3/4 problems', other: 'Rank-based shortlisting' },
    resources: [
      { name: 'CognizantGenext', link: 'https://careers.cognizant.com/' },
      { name: 'Cognizant Interview Experiences', link: 'https://www.interviewbit.com/coding-problems/' },
    ],
    tips: [
      'Difficult coding problems - practice 100+ Leetcode problems',
      'Time management is crucial',
      'Know Big O complexity inside out',
      'Be ready to optimize further after solving',
    ]
  },
  {
    name: 'Capgemini',
    logo: '🟦',
    color: 'from-cyan-600 to-blue-600',
    exam: 'Capgemini Tech Challenge',
    rounds: [
      { name: 'Coding Round', duration: '90 mins', details: '2 Coding problems (Easy to Medium)' },
      { name: 'Technical Interview', duration: '30-40 mins', details: 'Software design, SOLID principles, patterns' },
      { name: 'HR Round', duration: '20 mins', details: 'Culture fit, learning mindset, growth potential' },
    ],
    cutoff: { coding: 'Partial marks acceptable', other: 'Code quality matters more than speed' },
    resources: [
      { name: 'Capgemini Campus', link: 'https://www.capgemini.com/careers/' },
      { name: 'Capgemini Interview Q&A', link: 'https://www.geeksforgeeks.org/capgemini/' },
    ],
    tips: [
      'Write clean, readable code with comments',
      'Follow SOLID principles',
      'Design patterns and architecture questions',
      'Growth mindset and learning agility valued',
    ]
  },
  {
    name: 'HCL Tech',
    logo: '🔴',
    color: 'from-teal-600 to-green-600',
    exam: 'HCL Tech Campus Program',
    rounds: [
      { name: 'Online Round', duration: '90 mins', details: '1-2 Coding + Aptitude section' },
      { name: 'Technical Interview', duration: '45 mins', details: 'Coding, Java/Python, databases, projects' },
      { name: 'HR Round', duration: '20 mins', details: 'Background, career goals, relocation' },
    ],
    cutoff: { coding: 'Any 1 full or partial', aptitude: '55%', other: 'Partial marks given' },
    resources: [
      { name: 'HCL Recruitment', link: 'https://www.hcltech.com/careers' },
      { name: 'HCL Interview', link: 'https://www.interviewbit.com/coding-problems/' },
    ],
    tips: [
      'Focus on basic to medium DSA problems',
      'Database queries (SQL) are frequently asked',
      'Industry experience or internships help',
      'Cultural diversity valued by HCL',
    ]
  },
  {
    name: 'Tech Mahindra',
    logo: '🟠',
    color: 'from-red-600 to-orange-600',
    exam: 'Tech Mahindra Smart Hiring',
    rounds: [
      { name: 'Online Test', duration: '180 mins', details: '2 Coding + English + Aptitude' },
      { name: 'Technical Interview', duration: '30-45 mins', details: 'Problem-solving, core concepts, internship/project' },
      { name: 'Cross-Functional Interview', duration: '20-30 mins', details: 'Communication, teamwork, versatility' },
    ],
    cutoff: { coding: 'Atleast 1 full', aptitude: '60%', gated: 'Tier-based hiring' },
    resources: [
      { name: 'Tech Mahindra Careers', link: 'https://www.techmahindra.com/careers' },
      { name: 'TCS vs TM vs Wipro Comparison', link: 'https://www.geeksforgeeks.org/tech-mahindra/' },
    ],
    tips: [
      'Good for freshers - learning opportunity',
      'Mid to Hard DSA problems',
      'Soft skills equally important',
      'Cross-functional team collaboration valued',
    ]
  },
];

const nonItCompanies = [
  {
    name: 'Reliance Industries',
    logo: '⚡',
    color: 'from-orange-600 to-amber-600',
    exam: 'Reliance JET Exam',
    rounds: [
      { name: 'Written Exam', duration: '120 mins', details: 'Physics, Chemistry, Maths (PCM) or English, Reasoning, General Awareness' },
      { name: 'Group Discussion', duration: '20-30 mins', details: 'Technical/General topics, communication skills' },
      { name: 'Personal Interview', duration: '30-40 mins', details: 'Academic background, industry knowledge, motivation' },
    ],
    cutoff: { exam: 'Approximately 40-50%', gated: 'Cutoff varies by branch' },
    resources: [
      { name: 'Reliance JET Portal', link: 'https://www.rajastan.jobs/' },
      { name: 'Previous Papers', link: 'https://www.jeemain.ac.in/' },
    ],
    tips: [
      'Strong fundamentals in PCM/non-technical subjects required',
      'Current affairs and business awareness important',
      'Reliance operations knowledge helps',
      'Personality and communication valued',
    ]
  },
  {
    name: 'BPCL / HPCL / IOCL',
    logo: '🛢️',
    color: 'from-amber-600 to-yellow-600',
    exam: 'PSU Written Test + Interview',
    rounds: [
      { name: 'Preliminary Exam', duration: '60 mins', details: 'General Knowledge, English, Reasoning (Objective)' },
      { name: 'Mains Exam', duration: '120 mins', details: 'Technical Knowledge, Aptitude, Descriptive Writing' },
      { name: 'Group Discussion', duration: '15-20 mins', details: 'Technical/current topics' },
      { name: 'Interview', duration: '30-40 mins', details: 'Academic, technical, motivational questions' },
    ],
    cutoff: { prelim: '30-40%', mains: '50-60%', gated: 'PSU grade-based' },
    resources: [
      { name: 'BPCL Official', link: 'https://www.bpcl.com/en/careers' },
      { name: 'HPCL Careers', link: 'https://www.hindustanpetroleum.com/career' },
      { name: 'IOCL Recruitment', link: 'https://iocl.com/' },
    ],
    tips: [
      'Focus on current affairs and business news',
      'Technical knowledge based on engineering discipline',
      'Government policies and energy sector',
      'PSU is job security - good compensation',
    ]
  },
  {
    name: 'L&T',
    logo: '🏗️',
    color: 'from-green-600 to-emerald-600',
    exam: 'L&T Campus Recruitment',
    rounds: [
      { name: 'Online Test', duration: '120 mins', details: 'Aptitude, Technical MCQ, English comprehension' },
      { name: 'Group Discussion', duration: '15 mins', details: 'Case study or general management topic' },
      { name: 'Technical Interview', duration: '30-45 mins', details: 'Engineering fundamentals, project explanation' },
      { name: 'HR Interview', duration: '20-30 mins', details: 'Background, expectations, fit' },
    ],
    cutoff: { exam: '60%', gated: 'Merit-based selection' },
    resources: [
      { name: 'L&T Careers', link: 'https://careers.larsentoubro.com/' },
      { name: 'Company Info', link: 'https://www.larsentoubro.com/' },
    ],
    tips: [
      'Aptitude focus - calculations, reasoning',
      'Engineering core concepts important',
      'Infrastructure/construction industry knowledge',
      'L&T values technical excellence and innovation',
    ]
  },
  {
    name: 'Mahindra Group',
    logo: '🚗',
    color: 'from-red-600 to-rose-600',
    exam: 'Mahindra Campus Challenge',
    rounds: [
      { name: 'Online Assessment', duration: '90 mins', details: 'General Aptitude, Logical Reasoning, Verbal Skills' },
      { name: 'Group Exercise', duration: '20-30 mins', details: 'Case study, group problem-solving' },
      { name: 'Personal Interview', duration: '30-45 mins', details: 'Motivation, technical knowledge, problem-solving' },
    ],
    cutoff: { online: '55-65%', gated: 'Performance-based shortlisting' },
    resources: [
      { name: 'Mahindra Careers', link: 'https://careers.mahindra.com/' },
      { name: 'Mahindra Group Info', link: 'https://www.mahindra.com/' },
    ],
    tips: [
      'Automotive industry knowledge helpful',
      'Sustainability and green technology initiatives',
      'Mahindra values diversity and inclusion',
      'Strong analytical skills required',
    ]
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06 } }),
};

function CompanyCard({ company }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all"
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className={`p-4 cursor-pointer flex items-start justify-between transition-all ${
          expanded ? 'bg-gradient-to-r ' + company.color : 'bg-slate-50 dark:bg-slate-800'
        }`}
      >
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0`}>
            {company.logo}
          </div>
          <div className="min-w-0">
            <h3 className={`font-semibold text-sm ${
              expanded ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}>{company.name}</h3>
            <p className={`text-xs ${
              expanded ? 'text-white/80' : 'text-slate-500'
            }`}>{company.exam}</p>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
          <FiChevronDown size={16} className={expanded ? 'text-white' : 'text-slate-400'} />
        </motion.div>
      </div>

      {/* Expanded Content */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 space-y-4 border-t border-slate-200 dark:border-slate-800">
          {/* Rounds */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
              <FiClock size={14} /> Selection Process
            </h4>
            <div className="space-y-2">
              {company.rounds.map((round, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-slate-900 dark:text-white text-xs">{round.name}</p>
                    <span className="text-[10px] bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                      {round.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{round.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cut-offs */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
              <FiCheck size={14} /> Expected Cut-offs
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(company.cutoff).map(([key, value]) => (
                <div key={key} className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 capitalize">{key}</p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">Preparation Tips</h4>
            <ul className="space-y-1">
              {company.tips.map((tip, idx) => (
                <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">Resources & Links</h4>
            <div className="space-y-1.5">
              {company.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition group"
                >
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:underline">{resource.name}</p>
                  <FiExternalLink size={12} className="text-blue-400 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CompanyExams() {
  const [activeTab, setActiveTab] = useState('it');

  const companies = activeTab === 'it' ? itCompanies : nonItCompanies;

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
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center shadow-lg">
            <FiServer size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">IT & Non-IT Company Exams</h1>
            <p className="text-slate-500 text-sm">Complete exam details, rounds, resources & preparation tips</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-1.5">
            <FiServer size={11} /> 100% Accurate Details
          </span>
          <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
            ✓ All Resources Verified
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { label: 'IT Companies', icon: FiMonitor, key: 'it' },
          { label: 'Non-IT Companies', icon: FiBox, key: 'nonit' },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25'
                  : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={15} />
              {tab.label} ({tab.key === 'it' ? itCompanies.length : nonItCompanies.length})
            </button>
          );
        })}
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {companies.map((company, i) => (
          <motion.div
            key={company.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <CompanyCard company={company} />
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border border-violet-200 dark:border-violet-800 rounded-xl"
      >
        <h3 className="font-semibold text-violet-900 dark:text-violet-300 mb-3">💡 General Preparation Tips</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-violet-800 dark:text-violet-200">
          <li>✓ Start preparation 3-4 months before campus drive</li>
          <li>✓ Practice at least 100+ coding problems</li>
          <li>✓ Clear fundamentals of DSA, DBMS, OS</li>
          <li>✓ Master your projects - be ready to explain everything</li>
          <li>✓ Current affairs and GD topics important</li>
          <li>✓ Mock interviews help build confidence</li>
        </ul>
      </motion.div>
    </div>
  );
}
