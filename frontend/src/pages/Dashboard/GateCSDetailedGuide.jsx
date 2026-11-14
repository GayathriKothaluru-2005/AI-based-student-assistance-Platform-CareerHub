import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiBook, FiPlayCircle,
  FiTarget, FiAward, FiChevronDown,
  FiGlobe, FiCode, FiExternalLink
} from 'react-icons/fi';

/* ════════════════════════════════════════════════════════════════════ */
/* GATE CS COMPREHENSIVE GUIDE - TOPPERS EDITION */
/* ════════════════════════════════════════════════════════════════════ */

const syllabusBreakdown = [
  {
    category: 'Discrete Mathematics',
    weightage: '18-22%',
    topics: [
      { name: 'Set Theory & Functions', marks: '1-2' },
      { name: 'Propositional Logic', marks: '1-2' },
      { name: 'Predicate Logic', marks: '1' },
      { name: 'Combinatorics', marks: '2-3' },
      { name: 'Graph Theory', marks: '2-3' },
      { name: 'Counting Principles', marks: '1-2' },
      { name: 'Recurrence Relations', marks: '1-2' },
    ],
    resources: {
      textbooks: [
        { title: 'Discrete Mathematics & Its Applications', author: 'Kenneth H. Rosen', url: 'https://www.amazon.in/Discrete-Mathematics-Applications-Kenneth-Rosen/dp/0073383090' }
      ],
      youtubeChannels: [
        { name: 'Gate Smashers', url: 'https://www.youtube.com/@GateSmashers' },
        { name: 'Jenny\'s Lectures', url: 'https://www.youtube.com/@JennysLecturesCSIT' }
      ],
      freeResources: [
        { name: 'GATE Overflow', url: 'https://gateoverflow.in' },
        { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/gate' }
      ]
    }
  },
  {
    category: 'Data Structures & Algorithms',
    weightage: '20-24%',
    topics: [
      { name: 'Arrays, Linked Lists, Stacks, Queues', marks: '2-3' },
      { name: 'Trees (BST, AVL, B-Trees)', marks: '3-4' },
      { name: 'Graphs (DFS, BFS, Shortest Path)', marks: '3-4' },
      { name: 'Sorting & Searching', marks: '2-3' },
      { name: 'Hash Tables & Hashing', marks: '1-2' },
      { name: 'Algorithm Analysis (Time/Space Complexity)', marks: '2-3' },
      { name: 'Greedy, Divide & Conquer, Dynamic Programming', marks: '3-4' },
    ],
    resources: {
      textbooks: [
        { title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest, Stein', url: 'https://www.amazon.in/Introduction-Algorithms-Thomas-H-Cormen/dp/9788120340077' },
        { title: 'Data Structures Using C', author: 'Reema Thareja', url: 'https://www.amazon.in/Data-Structures-Using-Reema-Thareja/dp/019806029X' }
      ],
      youtubeChannels: [
        { name: 'Abdul Bari', url: 'https://www.youtube.com/@abdul_bari' },
        { name: 'Gate Smashers', url: 'https://www.youtube.com/@GateSmashers' },
        { name: 'One Shot', url: 'https://www.youtube.com/@OneShotCourses' }
      ],
      freeResources: [
        { name: 'GeeksforGeeks DSA', url: 'https://www.geeksforgeeks.org/gate' },
        { name: 'InterviewBit', url: 'https://www.interviewbit.com' },
        { name: 'LeetCode', url: 'https://leetcode.com' }
      ]
    }
  },
  {
    category: 'Database Management',
    weightage: '8-12%',
    topics: [
      { name: 'Relational Model & Algebra', marks: '1-2' },
      { name: 'Normalization (1NF to BCNF)', marks: '2-3' },
      { name: 'Transactions & Concurrency Control', marks: '1-2' },
      { name: 'Indexing & Query Processing', marks: '1-2' },
      { name: 'SQL Basics', marks: '1' },
    ],
    resources: {
      textbooks: [
        { title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', url: 'https://www.amazon.in/Database-System-Concepts-Abraham-Silberschatz/dp/0078022150' }
      ],
      youtubeChannels: [
        { name: 'Gate Smashers', url: 'https://www.youtube.com/@GateSmashers' },
        { name: 'Neso Academy', url: 'https://www.youtube.com/@nesoacademy' }
      ],
      freeResources: [
        { name: 'GATE Overflow', url: 'https://gateoverflow.in' },
        { name: 'GeeksforGeeks DBMS', url: 'https://www.geeksforgeeks.org/gate' }
      ]
    }
  },
  {
    category: 'Operating Systems',
    weightage: '8-12%',
    topics: [
      { name: 'Process Management & Scheduling', marks: '2-3' },
      { name: 'Memory Management & Virtual Memory', marks: '2-3' },
      { name: 'Concurrency, Deadlock, Synchronization', marks: '2-3' },
      { name: 'File Systems & IO', marks: '1-2' },
      { name: 'Disk Scheduling', marks: '1' },
    ],
    resources: {
      textbooks: [
        { title: 'Operating System Concepts', author: 'Silberschatz, Galvin, Gagne', url: 'https://www.amazon.in/Operating-System-Concepts-Abraham-Silberschatz/dp/8126522127' },
        { title: 'Advanced Programming in UNIX Environment', author: 'W. Richard Stevens', url: 'https://www.amazon.in/Advanced-Programming-UNIX-Environment-Stevens/dp/0201563307' }
      ],
      youtubeChannels: [
        { name: 'Gate Smashers', url: 'https://www.youtube.com/@GateSmashers' },
        { name: 'Neso Academy', url: 'https://www.youtube.com/@nesoacademy' },
        { name: 'One Shot', url: 'https://www.youtube.com/@OneShotCourses' }
      ],
      freeResources: [
        { name: 'NPTEL Online Courses', url: 'https://nptel.ac.in' },
        { name: 'GeeksforGeeks OS', url: 'https://www.geeksforgeeks.org/gate' }
      ]
    }
  },
  {
    category: 'Computer Networks',
    weightage: '8-12%',
    topics: [
      { name: 'OSI & TCP/IP Models', marks: '1-2' },
      { name: 'Data Link Layer (MAC, Error Detection)', marks: '1-2' },
      { name: 'Network Layer (IP, Routing, CIDR)', marks: '2-3' },
      { name: 'Transport Layer (TCP, UDP)', marks: '2-3' },
      { name: 'Application Layer (DNS, HTTP, FTP)', marks: '1-2' },
      { name: 'Network Security (Cryptography, Firewalls)', marks: '1-2' },
    ],
    resources: {
      textbooks: [
        { title: 'Computer Networks: A Top-Down Approach', author: 'Kurose, Ross', url: 'https://www.amazon.in/Computer-Networks-Top-Down-Approach-Kurose/dp/9332518975' }
      ],
      youtubeChannels: [
        { name: 'Gate Smashers', url: 'https://www.youtube.com/@GateSmashers' },
        { name: 'Neso Academy', url: 'https://www.youtube.com/@nesoacademy' }
      ],
      freeResources: [
        { name: 'GATE Overflow Networks', url: 'https://gateoverflow.in' },
        { name: 'GeeksforGeeks Networks', url: 'https://www.geeksforgeeks.org/gate' }
      ]
    }
  },
  {
    category: 'Digital Logic & Microprocessors',
    weightage: '6-10%',
    topics: [
      { name: 'Boolean Algebra & Minimization', marks: '1-2' },
      { name: 'Combinational Circuits', marks: '1-2' },
      { name: 'Sequential Circuits (Flip-flops, Counters)', marks: '1-2' },
      { name: 'Memory & Microprocessor Basics', marks: '1' },
    ],
    resources: {
      textbooks: [
        { title: 'Digital Logic & Computer Design', author: 'M. Morris Mano', url: 'https://www.amazon.in/Digital-Logic-Computer-Design-Morris/dp/9332519600' }
      ],
      youtubeChannels: [
        { name: 'Neso Academy', url: 'https://www.youtube.com/@nesoacademy' },
        { name: 'Gate Smashers', url: 'https://www.youtube.com/@GateSmashers' }
      ],
      freeResources: [
        { name: 'NPTEL Courses', url: 'https://nptel.ac.in' },
        { name: 'GeeksforGeeks Digital Logic', url: 'https://www.geeksforgeeks.org/gate' }
      ]
    }
  },
  {
    category: 'Theory of Computation',
    weightage: '8-12%',
    topics: [
      { name: 'Regular Languages & DFA/NFA', marks: '2-3' },
      { name: 'Context-Free Grammars & Pushdown Automata', marks: '2-3' },
      { name: 'Turing Machines & Decidability', marks: '1-2' },
      { name: 'Computational Complexity (P, NP, NPC)', marks: '2-3' },
    ],
    resources: {
      textbooks: [
        { title: 'Theory of Computation', author: 'Ullman, Hopcroft, Motwani', url: 'https://www.amazon.in/Theory-Computation-John-E-Hopcroft/dp/8131305260' }
      ],
      youtubeChannels: [
        { name: 'Jenny\'s Lectures', url: 'https://www.youtube.com/@JennysLecturesCSIT' },
        { name: 'Gate Smashers', url: 'https://www.youtube.com/@GateSmashers' }
      ],
      freeResources: [
        { name: 'GATE Overflow TOC', url: 'https://gateoverflow.in' },
        { name: 'GeeksforGeeks TOC', url: 'https://www.geeksforgeeks.org/gate' }
      ]
    }
  },
  {
    category: 'Compiler Design',
    weightage: '4-8%',
    topics: [
      { name: 'Lexical Analysis & Parsing', marks: '1-2' },
      { name: 'Syntax Trees & Code Generation', marks: '1-2' },
      { name: 'Symbol Tables & Type Checking', marks: '1' },
    ],
    resources: {
      textbooks: [
        { title: 'Compilers: Principles, Techniques, and Tools', author: 'Aho, Lam, Sethi, Ullman', url: 'https://www.amazon.in/Compilers-Principles-Techniques-Tools-Aho/dp/8131305260' }
      ],
      youtubeChannels: [
        { name: 'Gate Smashers', url: 'https://www.youtube.com/@GateSmashers' },
        { name: 'Neso Academy', url: 'https://www.youtube.com/@nesoacademy' }
      ],
      freeResources: [
        { name: 'GATE Overflow Compiler', url: 'https://gateoverflow.in' },
        { name: 'GeeksforGeeks Compiler Design', url: 'https://www.geeksforgeeks.org/gate' }
      ]
    }
  },
  {
    category: 'Software Engineering & Web Technologies',
    weightage: '2-4%',
    topics: [
      { name: 'SDLC & Methodologies', marks: '1' },
      { name: 'Testing & Quality Assurance', marks: '1' },
    ],
    resources: {
      textbooks: [
        { title: 'Software Engineering: A Practitioner\'s Approach', author: 'Roger Pressman', url: 'https://www.amazon.in/Software-Engineering-Practitioners-Roger-Pressman/dp/9332578603' }
      ],
      youtubeChannels: [
        { name: 'Gate Smashers', url: 'https://www.youtube.com/@GateSmashers' }
      ],
      freeResources: [
        { name: 'GeeksforGeeks SE', url: 'https://www.geeksforgeeks.org/gate' }
      ]
    }
  },
];

const bestResources = {
  textbooks: [
    {
      rank: '🥇 MUST-HAVE',
      books: [
        { title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest, Stein', why: 'Bible for DSA, problem-solving, proof writing. Most important!' },
        { title: 'Discrete Mathematics & Its Applications', author: 'Kenneth H. Rosen', why: 'Comprehensive discrete math with GATE-relevant topics' },
        { title: 'Operating System Concepts', author: 'Silberschatz, Galvin, Gagne', why: 'Standard OS textbook, covers all major OS topics' },
        { title: 'Computer Networks: A Top-Down Approach', author: 'Kurose, Ross', why: 'Best for networking concepts with practical examples' },
      ],
    },
    {
      rank: '🥈 IMPORTANT',
      books: [
        { title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', why: 'Covers DBMS theory, normalization, transactions' },
        { title: 'Digital Logic & Computer Design', author: 'M. Morris Mano', why: 'Best for digital logic and microprocessor basics' },
        { title: 'Advanced Programming in UNIX Environment', author: 'W. Richard Stevens', why: 'Deep OS and systems programming knowledge' },
      ],
    },
    {
      rank: '🥉 SUPPLEMENTARY',
      books: [
        { title: 'Data Structures Using C', author: 'Reema Thareja', why: 'Good for implementation-focused DSA learning' },
        { title: 'Theory of Computation', author: 'Ullman, Hopcroft, Motwani', why: 'Comprehensive automata and complexity theory' },
      ],
    },
  ],
  youtubeChannels: [
    {
      name: 'Gate Smashers',
      strength: '⭐ Best for: Complete syllabus coverage, formula-based shortcuts, high-quality animations',
      topics: 'All subjects covered with exam-focused explanations',
      pros: ['Well-organized playlists', 'Easy-to-understand', 'Regular updates', 'Covers tricks'],
    },
    {
      name: 'One Shot',
      strength: '⭐ Best for: Single-video complete topic coverage, interviews with toppers',
      topics: 'Condensed content in one video per topic',
      pros: ['Time-efficient', 'Topper interviews', 'Quick revision', 'No fluff'],
    },
    {
      name: 'Jenny\'s Lectures (CS)',
      strength: '⭐ Best for: Theory of Computation, Compiler Design, grammar-based topics',
      topics: 'Specialized in automata and complexity theory',
      pros: ['Clear explanations', 'Drawing-based teaching', 'Proven methods'],
    },
    {
      name: 'Neso Academy',
      strength: '⭐ Best for: Digital Logic, Microprocessors, Operating Systems',
      topics: 'Visual explanations with animations',
      pros: ['High production quality', 'Detailed coverage', 'Theory + implementation'],
    },
    {
      name: 'Abdul Bari',
      strength: '⭐ Best for: Data Structures & Algorithms deep dive',
      topics: 'DSA from scratch with visualizations',
      pros: ['Complete DSA course', 'Algorithm complexity analysis', 'Code implementation'],
    },
    {
      name: 'CS Bites (Srinivas Coding Adda)',
      strength: '⭐ Best for: Quick revision, previous year questions',
      topics: 'Short & quick video explanations',
      pros: ['PYQ explanations', 'Quick tips', 'Time-efficient'],
    },
  ],
  freeResources: [
    { name: 'GATE Overflow', url: 'https://gateoverflow.in', strength: 'PYQ discussions, community solutions, most trusted by toppers' },
    { name: 'GeeksforGeeks GATE Articles', url: 'https://www.geeksforgeeks.org/gate', strength: 'Comprehensive article bank covering all topics with examples' },
    { name: 'InterviewBit (Free Tier)', url: 'https://www.interviewbit.com', strength: 'DSA practice with visual explanations' },
    { name: 'NPTEL Online Courses', url: 'https://nptel.ac.in', strength: 'IIT-quality lectures from top professors, completely free' },
    { name: 'LeetCode Easy Problems', url: 'https://leetcode.com', strength: 'DSA implementation practice with solutions' },
    { name: 'CS75 (Udacity)', url: 'https://www.udacity.com', strength: 'Free computer science fundamentals course' },
  ],
  paidResources: [
    { name: 'Gradeup GATE CSE Course', strength: 'Complete video course + tests, best for structured learning' },
    { name: 'Unacademy GATE CSE', strength: 'Live classes, doubt resolution, interactive learning' },
    { name: '2IITJEE GATE+ESE', strength: 'Comprehensive coverage with assignment delivery' },
  ],
};

const importantTopics = [
  { priority: '🔴 CRITICAL (Must-Do)', marks: '30-35', topics: ['Binary Search Trees', 'Graph Algorithms (DFS/BFS/Dijkstra)', 'Dynamic Programming', 'Sorting Algorithms (Quicksort, Mergesort)', 'Process Scheduling', 'Virtual Memory & Paging', 'Network Layer (IP, Routing)'] },
  { priority: '🟠 HIGH PRIORITY', marks: '20-25', topics: ['Linked Lists & Stack/Queue', 'Normalization & SQL', 'Deadlock & Synchronization', 'B Trees & Hashing', 'DFA/NFA & Regular Expressions', 'Transport Layer (TCP/UDP)', 'Boolean Algebra'] },
  { priority: '🟡 MEDIUM PRIORITY', marks: '15-20', topics: ['Set Theory & Functions', 'Heap & Priority Queue', 'File Systems', 'Indexing & Query Processing', 'Context-Free Grammars', 'Data Link Layer', 'Combinatorics'] },
  { priority: '🟢 OPTIONAL', marks: '<10', topics: ['Advanced Compiler Concepts', 'Cache Optimization', 'Specialized Software Engineering', 'Advanced Cryptography'] },
];

const preparationStrategy = {
  beginner: {
    duration: '2-3 months',
    focus: ['Foundation building', 'Understanding concepts', 'Weak areas identification'],
    books: ['Rosen (Discrete Math)', 'CLRS (DSA)', 'GeeksforGeeks articles'],
    time_allocation: { theory: '70%', practice: '30%' },
    activities: ['Watch YouTube playlists', 'Read textbooks', 'Solve basic problems', 'Take subject tests'],
  },
  intermediate: {
    duration: '2-3 months',
    focus: ['Deep problem solving', 'Mixed concept questions', 'Speed building'],
    books: ['CLRS', 'Subject-specific textbooks', 'Previous year papers'],
    time_allocation: { theory: '40%', practice: '60%' },
    activities: ['Solve previous year papers (3x)', 'Topic-wise mock tests', 'Study PYQ patterns', 'Concept integration'],
  },
  advanced: {
    duration: '1-2 months',
    focus: ['Full-length tests', 'Time management', 'Final revision'],
    books: ['Revision notes', 'PYQs', 'Mock test analysis'],
    time_allocation: { theory: '20%', practice: '80%' },
    activities: ['Take full-length tests', 'Analyze mistakes', 'Quick revision', 'Multiple attempts per PYQ'],
  },
};

const practiceResources = [
  { name: 'GATE Overflow Mock Tests', type: '🎯 Tests', strength: 'Most accurate difficulty level, used by 100k+ toppers' },
  { name: 'GeeksforGeeks TopicWise Practice', type: '📝 Practice Sets', strength: 'Free, comprehensive topic-wise problems' },
  { name: 'Gradeup GATE Full Length Mocks', type: '🎯 Tests', strength: 'Tests at official exam difficulty level' },
  { name: 'Codechef/SPOJ Problems', type: '💻 Coding', strength: 'Implementation-based DSA practice' },
  { name: 'LeetCode (Premium)', type: '💻 Paid Coding', strength: 'High-quality problems with editorials' },
  { name: 'HackerRank Challenges', type: '💻 Free Coding', strength: 'Various difficulty levels for practice' },
];

const pyqAnalysis = {
  distribution: [
    { year_range: '2020-2024', analysis: 'Increasing problem-solving weightage, less rote memorization' },
    { year_range: '2015-2019', analysis: 'Balanced mix of theory and problems' },
    { year_range: '2010-2014', analysis: 'Theory-heavy, calculation-based' },
    { year_range: '2000-2009', analysis: 'Basic concepts, directional questions' },
  ],
  repeatedConcepts: [
    { concept: 'Big-O Complexity Analysis', count: '10+ questions', priority: '🔴 Critical' },
    { concept: 'Graph Traversal & Shortest Path', count: '8+ questions', priority: '🔴 Critical' },
    { concept: 'Tree Traversals & BST Operations', count: '7+ questions', priority: '🔴 Critical' },
    { concept: 'Deadlock Detection & Prevention', count: '6+ questions', priority: '🟠 High' },
    { concept: 'Page Replacement Algorithms', count: '6+ questions', priority: '🟠 High' },
    { concept: 'Normalization & Functional Dependencies', count: '5+ questions', priority: '🟠 High' },
    { concept: 'Subnet Masking & CIDR', count: '5+ questions', priority: '🟠 High' },
    { concept: 'DFA/NFA Minimization', count: '4+ questions', priority: '🟡 Medium' },
  ],
};

const proTips = [
  '💡 **Master the Standard Algorithms:** Implement Dijkstra, Floyd-Warshall, KMP, Merge Sort from scratch. Being algorithm-efficient is 30% of the exam.',
  '💡 **PYQ is Your Friend:** Solve previous 25 years papers at least 3 times. 70% of GATE can be solved by mastering PYQs pattern and variations.',
  '💡 **Time Management:** First 50 min = easy 1-mark questions (boost confidence), Next 50 min = medium 2-mark questions, Last 20 min = complex problems.',
  '💡 **The Theory-Practice Ratio:** Theory for 1 month = Practice for 5 months. DSA requires coding to understand.',
  '💡 **Speed + Accuracy Hacks:** Memorize complexity of standard algorithms, flowchart patterns, formula tricks. Practice speed-solving.',
  '💡 **Mock Test Analysis:** Never just take tests. Spend 2 hours analyzing 1 test. Identify weakness patterns.',
  '💡 **Topic Connections:** Understand how OS scheduling relates to DSA trees, how normalization relates to algorithms. Holistic approach scores better.',
  '💡 **Negative Marking:** First solve all 1-mark questions confidently, then 2-mark. Never guess on 2-mark (costs 2/3 net).',
  '💡 **Revision Strategy:** Week 1: Formulas only (2 hrs/day), Week 2: Previous tests + weak areas (3 hrs/day), Week 3: Speed solving (2.5 hrs/day).',
  '💡 **Common Mistakes:** Confusing TCP/UDP, mixing DFA/NFA, deadlock conditions, page replacement algorithms, SQL joins. Keep a mistakes log.',
];

const revisionStrategy = {
  phase1: {
    title: '3 weeks before exam',
    focus: 'Complete syllabus revision with formula sheets',
    daily_schedule: ['30 min: Read formula sheet', '60 min: Topic-wise PYQs', '30 min: Weak topics deep dive'],
  },
  phase2: {
    title: '2 weeks before exam',
    focus: 'Mixed concept testing and speed practice',
    daily_schedule: ['90 min: Full mock test', '60 min: Test analysis', '30 min: Weak areas revision'],
  },
  phase3: {
    title: '1 week before exam',
    focus: 'Final touches and confidence building',
    daily_schedule: ['120 min: Full-length test', '60 min: Review fundamentals', '30 min: Stress management'],
  },
};

/* ════════════════════════════════════════════════════════════════════ */
/* COMPONENTS */
/* ════════════════════════════════════════════════════════════════════ */

function CollapsibleSection({ title, icon: Icon, content, color = 'blue', children }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const colorClasses = {
    blue: 'from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-blue-200 dark:border-blue-800',
    purple: 'from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 border-purple-200 dark:border-purple-800',
    green: 'from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800',
    orange: 'from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border-orange-200 dark:border-orange-800',
    red: 'from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 border-red-200 dark:border-red-800',
  };

  const iconColors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  return (
    <motion.div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg overflow-hidden`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-black/3 dark:hover:bg-white/3 transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className={`${iconColors[color]} p-2 rounded-lg flex-shrink-0`}>
            <Icon size={16} className="text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronDown size={16} className="text-slate-500" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden border-t border-slate-200 dark:border-slate-700/50"
      >
        <div className="px-4 py-4">
          {children || <div className="text-sm text-slate-700 dark:text-slate-300">{content}</div>}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* MAIN COMPONENT */
export default function GateCSDetailedGuide() {
  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
            <FiCode size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">GATE CS/IT Comprehensive Guide</h1>
            <p className="text-slate-500 text-sm mt-1">
              ✓ Complete Syllabus • ✓ Topper-Verified Resources • ✓ Proven Strategies • ✓ 25 Years PYQ Analysis
            </p>
          </div>
        </div>
      </motion.div>

      {/* 1. SYLLABUS BREAKDOWN */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📘</span> Subjects Covered & Resources
        </h2>
        <div className="space-y-3">
          {syllabusBreakdown.map((subject, idx) => (
            <CollapsibleSection
              key={idx}
              title={`${subject.category} (${subject.weightage})`}
              icon={FiBook}
              color={['blue', 'purple', 'green', 'orange', 'red', 'blue', 'purple', 'orange', 'green'][idx % 9]}
            >
              <div className="space-y-4">
                {/* Topics */}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">Topics Covered:</h4>
                  <div className="space-y-2">
                    {subject.topics.map((topic, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-slate-700 dark:text-slate-300">• {topic.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {topic.marks} marks
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div className="border-t border-slate-200 dark:border-slate-700/50 pt-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">🎯 Resources for this subject:</h4>
                  
                  {/* Textbooks */}
                  {subject.resources?.textbooks && subject.resources.textbooks.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">📖 Textbooks:</p>
                      <div className="space-y-1">
                        {subject.resources.textbooks.map((book, i) => (
                          <a
                            key={i}
                            href={book.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs block px-3 py-2 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <span><span className="font-semibold">{book.title}</span> by {book.author}</span>
                              <FiExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* YouTube Channels */}
                  {subject.resources?.youtubeChannels && subject.resources.youtubeChannels.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">🎥 YouTube Channels:</p>
                      <div className="flex flex-wrap gap-2">
                        {subject.resources.youtubeChannels.map((channel, i) => (
                          <a
                            key={i}
                            href={channel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors inline-flex items-center gap-1 group"
                          >
                            {channel.name}
                            <FiExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Free Resources */}
                  {subject.resources?.freeResources && subject.resources.freeResources.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">🌍 Free Resources:</p>
                      <div className="flex flex-wrap gap-2">
                        {subject.resources.freeResources.map((resource, i) => (
                          <a
                            key={i}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors inline-flex items-center gap-1 group"
                          >
                            {resource.name}
                            <FiExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleSection>
          ))}
        </div>
      </motion.div>

      {/* 2. IMPORTANT TOPICS RANKING */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span> High-Weightage Topics (Priority Matrix)
        </h2>
        <div className="space-y-3">
          {importantTopics.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
              <h4 className="text-sm font-bold mb-3">{section.priority}</h4>
              <div className="flex flex-wrap gap-2">
                {section.topics.map((topic, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium">
                    {topic}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">Estimated weightage: {section.marks}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3. BEST RESOURCES */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📚</span> Best Curated Resources
        </h2>

        {/* Textbooks */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 ml-2">📖 Standard Textbooks by Priority</h3>
          <div className="space-y-4">
            {bestResources.textbooks.map((tier, idx) => (
              <CollapsibleSection
                key={idx}
                title={tier.rank}
                icon={FiBook}
                color={['orange', 'blue', 'green'][idx]}
              >
                <div className="space-y-3">
                  {tier.books.map((book, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border-l-4 border-orange-400">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{book.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5"><strong>Author:</strong> {book.author}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">💡 {book.why}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </div>

        {/* YouTube Channels */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 ml-2">🎥 Best YouTube Channels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bestResources.youtubeChannels.map((channel, idx) => (
              <motion.div key={idx} className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-2">
                  <FiPlayCircle className="text-red-500 mt-1 flex-shrink-0" size={18} />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{channel.name}</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">{channel.strength}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Topics: {channel.topics}</p>
                <div className="flex flex-wrap gap-1">
                  {channel.pros.map((pro, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-red-200 dark:border-red-800">
                      ✓ {pro}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Free Resources */}
        <CollapsibleSection title="🌍 Free Online Resources (Trusted by Toppers)" icon={FiGlobe} color="green">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bestResources.freeResources.map((res, idx) => (
              <div key={idx} className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-semibold text-green-900 dark:text-green-100 text-sm">{res.name}</p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">{res.strength}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </motion.div>

      {/* 4. PREVIOUS YEAR QUESTIONS ANALYSIS */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span> Previous Year Questions (PYQ) Analysis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {pyqAnalysis.distribution.map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <p className="font-bold text-indigo-900 dark:text-indigo-100 text-sm">{item.year_range}</p>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">{item.analysis}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">Most Repeated Concepts (Last 25 Years)</h4>
          <div className="space-y-2">
            {pyqAnalysis.repeatedConcepts.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">{item.concept}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">{item.priority}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 5. PREPARATION STRATEGY */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🧭</span> 6+ Month Preparation Roadmap
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(preparationStrategy).map(([phase, details], idx) => (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4"
            >
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {phase.toUpperCase().replace('_', ' ')}
              </p>
              <p className="font-sharp text-slate-900 dark:text-white mt-1">{details.duration}</p>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mt-3">
                {details.focus.map((f, i) => <li key={i}>• {f}</li>)}
              </ul>
              <div className="text-xs mt-3 p-2 bg-white dark:bg-slate-800/50 rounded">
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Time Split:</p>
                <p>Theory: {details.time_allocation.theory}</p>
                <p>Practice: {details.time_allocation.practice}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 6. PRACTICE RESOURCES */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🧪</span> Practice Resources & Mock Tests
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {practiceResources.map((resource, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05 }}
              className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 border border-teal-200 dark:border-teal-800 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-teal-900 dark:text-teal-100 text-sm">{resource.name}</h4>
                <span className="text-xs px-2 py-0.5 rounded bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200 font-semibold">{resource.type}</span>
              </div>
              <p className="text-xs text-teal-700 dark:text-teal-300">✓ {resource.strength}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 7. REVISION STRATEGY */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🔄</span> Final Month Revision Strategy
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { phase: '3 WEEKS BEFORE', icon: FiBook, color: 'orange' },
            { phase: '2 WEEKS BEFORE', icon: FiTarget, color: 'purple' },
            { phase: '1 WEEK BEFORE', icon: FiAward, color: 'green' },
          ].map((item, idx) => (
            <CollapsibleSection
              key={idx}
              title={item.phase}
              icon={item.icon}
              color={item.color}
            >
              {idx === 0 && (
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">📌 Focus: Complete Syllabus Revision</p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {revisionStrategy.phase1.daily_schedule.map((activity, i) => (
                      <li key={i}>✓ {activity}</li>
                    ))}
                  </ul>
                </div>
              )}
              {idx === 1 && (
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">📌 Focus: Mixed Concept Testing</p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {revisionStrategy.phase2.daily_schedule.map((activity, i) => (
                      <li key={i}>✓ {activity}</li>
                    ))}
                  </ul>
                </div>
              )}
              {idx === 2 && (
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">📌 Focus: Final Touches</p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {revisionStrategy.phase3.daily_schedule.map((activity, i) => (
                      <li key={i}>✓ {activity}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CollapsibleSection>
          ))}
        </div>
      </motion.div>

      {/* 8. PRO TIPS */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span> Pro Tips from GATE Toppers
        </h2>
        
        <div className="space-y-3">
          {proTips.map((tip, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + idx * 0.04 }}
              className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
            >
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Final Note */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center"
      >
        <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2">🎯 Remember</p>
        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
          GATE is 70% about problem-solving skills and 30% about memorization. Master standard algorithms, solve PYQs religiously, take full-length mocks, and analyze your mistakes. With consistency for 6+ months, a 70+ score is achievable. Good luck! 🚀
        </p>
      </motion.div>
    </div>
  );
}
