import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShare2, FiLinkedin, FiCheckCircle, FiAlertCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const naukriTips = [
  // Profile Basics
  {
    category: 'Profile Headline',
    do: true,
    tip: 'Use keyword-rich headline with job role and experience level (e.g., "Senior Full Stack Developer with 5 Years React & Node.js Experience")',
  },
  {
    category: 'Profile Headline',
    do: false,
    tip: 'Don\'t use generic headlines like "Job Seeker" or "Fresher looking for opportunities"',
  },
  // Professional Photo
  {
    category: 'Professional Photo',
    do: true,
    tip: 'Upload a high-quality professional headshot with plain white/light background and smiling face (increases profile visits 3x)',
  },
  {
    category: 'Professional Photo',
    do: false,
    tip: 'Don\'t use casual selfies, group photos, or pictures with poor lighting/background',
  },
  // Open to Work
  {
    category: 'Open to Work Status',
    do: true,
    tip: 'Keep "Open to work" status ON with specific job roles, industries, and preferred locations',
  },
  {
    category: 'Open to Work Status',
    do: false,
    tip: 'Don\'t forget to update availability status or leave vague job preferences',
  },
  // Skills
  {
    category: 'Skills Section',
    do: true,
    tip: 'Add 50-100+ skills with 70% technical and 30% soft skills (problem-solving, communication, leadership)',
  },
  {
    category: 'Skills Section',
    do: false,
    tip: 'Don\'t add irrelevant or random skills that don\'t match your target roles',
  },
  // About Section
  {
    category: 'About/Summary',
    do: true,
    tip: 'Write 200-300 character compelling summary highlighting key achievements, years of experience, and what you\'re looking for',
  },
  {
    category: 'About/Summary',
    do: false,
    tip: 'Don\'t write vague summaries or lengthy paragraphs that recruiters won\'t read',
  },
  // Keywords
  {
    category: 'Keyword Optimization',
    do: true,
    tip: 'Include industry keywords in headline, summary, and skills (e.g., SDE, Full Stack, AWS, Azure, Data Science)',
  },
  {
    category: 'Keyword Optimization',
    do: false,
    tip: 'Don\'t ignore SEO — without keywords, recruiter searches won\'t find your profile',
  },
  // Experience
  {
    category: 'Experience Details',
    do: true,
    tip: 'For each role, add detailed description with metrics (e.g., "Increased system performance by 40%", "Led team of 5")',
  },
  {
    category: 'Experience Details',
    do: false,
    tip: 'Don\'t just list job duties — recruiters want impact and achievements',
  },
  // Education
  {
    category: 'Education',
    do: true,
    tip: 'Add university, degree, CGPA/marks (if impressive), and relevant coursework related to target role',
  },
  {
    category: 'Education',
    do: false,
    tip: 'Don\'t leave education details blank or incomplete',
  },
  // Certifications
  {
    category: 'Certifications',
    do: true,
    tip: 'Add all relevant certifications (AWS, Azure, Google Cloud, Coursera, Udacity) with dates and links',
  },
  {
    category: 'Certifications',
    do: false,
    tip: 'Don\'t ignore certificates — they signal continuous learning and expertise',
  },
  // Contact Info
  {
    category: 'Contact Information',
    do: true,
    tip: 'Use professional email (firstname.lastname@gmail.com), correct phone number, and portfolio/GitHub links',
  },
  {
    category: 'Contact Information',
    do: false,
    tip: 'Don\'t use unprofessional email addresses or outdated contact information',
  },
  // Profile Completion
  {
    category: 'Profile Completeness',
    do: true,
    tip: 'Keep profile 100% complete (high visibility badge appears when profile is fully filled)',
  },
  {
    category: 'Profile Completeness',
    do: false,
    tip: 'Don\'t leave sections blank — incomplete profiles get 50% fewer recruiter visits',
  },
  // Profile Views
  {
    category: 'Profile Activity',
    do: true,
    tip: 'Update profile regularly (at least weekly) — recently updated profiles rank higher in recruiter searches',
  },
  {
    category: 'Profile Activity',
    do: false,
    tip: 'Don\'t keep profile dormant for months — recruiters check last activity date',
  },
  // Endorsements
  {
    category: 'Endorsements',
    do: true,
    tip: 'Ask colleagues to endorse your top skills — endorsements boost visibility in recruiter filters',
  },
  {
    category: 'Endorsements',
    do: false,
    tip: 'Don\'t ignore endorsements or have only 2-3 endorsements per skill',
  },
  // Salary Info
  {
    category: 'Salary & Benefits',
    do: true,
    tip: 'Set expected salary range with 10% flexibility and specify benefits you want (WFH, bond, notice period)',
  },
  {
    category: 'Salary & Benefits',
    do: false,
    tip: 'Don\'t set unrealistic salary expectations that filter you out from premium roles',
  },
];

const linkedinTips = [
  // Profile Photo
  {
    category: 'Profile Photo',
    do: true,
    tip: 'Use professional headshot with good lighting, clear face, plain background, and professional attire',
  },
  {
    category: 'Profile Photo',
    do: false,
    tip: 'Don\'t use casual/fun photos, group photos, or photos with poor lighting and cluttered backgrounds',
  },
  // Headline
  {
    category: 'Professional Headline',
    do: true,
    tip: 'Craft keyword-rich headline: "Senior Full Stack Engineer | React & Node.js | Cloud Architecture | Problem Solver"',
  },
  {
    category: 'Professional Headline',
    do: false,
    tip: 'Don\'t use just your job title — make it compelling and discoverable by adding skills and aspirations',
  },
  // About/About Me
  {
    category: 'About Section',
    do: true,
    tip: 'Write 2500+ character compelling story: your journey, skills, achievements, passions, and what you\'re looking for',
  },
  {
    category: 'About Section',
    do: false,
    tip: 'Don\'t write a boring CV summary or leave it blank — this is your chance to stand out',
  },
  // Keywords
  {
    category: 'Keyword Strategy',
    do: true,
    tip: 'Sprinkle high-search keywords throughout profile: your role, technologies, skills, and industry terms',
  },
  {
    category: 'Keyword Strategy',
    do: false,
    tip: 'Don\'t overload with keywords or "keyword stuff" — it looks spammy and decreases credibility',
  },
  // Custom URL
  {
    category: 'LinkedIn URL',
    do: true,
    tip: 'Customize your LinkedIn URL to something professional like "linkedin.com/in/john-developer"',
  },
  {
    category: 'LinkedIn URL',
    do: false,
    tip: 'Don\'t leave default random URL — it looks unprofessional and harder to share',
  },
  // Experience
  {
    category: 'Experience Section',
    do: true,
    tip: 'Add detailed descriptions with quantifiable achievements: "Led team of 8 engineers, shipped 5 products, increased user engagement by 45%"',
  },
  {
    category: 'Experience Section',
    do: false,
    tip: 'Don\'t just copy job descriptions — showcase impact, metrics, and what you actually accomplished',
  },
  // Recommendations
  {
    category: 'Endorsements & Recommendations',
    do: true,
    tip: 'Get 10+ recommendations from managers, colleagues, and clients highlighting your strengths and impact',
  },
  {
    category: 'Endorsements & Recommendations',
    do: false,
    tip: 'Don\'t skip recommendations — profiles with 5+ recommendations get 5x more recruiter interest',
  },
  // Skills Endorsements
  {
    category: 'Skill Endorsements',
    do: true,
    tip: 'Add 30-40 skills and ask connections to endorse them — prioritize most relevant skills at top',
  },
  {
    category: 'Skill Endorsements',
    do: false,
    tip: 'Don\'t have unskilled or irrelevant skills at the top of your list',
  },
  // Content Strategy
  {
    category: 'Content & Engagement',
    do: true,
    tip: 'Post 2-3 times per week: share insights, lessons learned, industry trends, or project victories to boost visibility',
  },
  {
    category: 'Content & Engagement',
    do: false,
    tip: 'Don\'t go silent for weeks or post only job-hunting desperation messages',
  },
  // Networking
  {
    category: 'Connection Building',
    do: true,
    tip: 'Build targeted connections (500+) with hiring managers, recruiters, and industry peers with personalized notes',
  },
  {
    category: 'Connection Building',
    do: false,
    tip: 'Don\'t send generic connection requests or spam people with "Let\'s connect" — add context',
  },
  // Follow Companies
  {
    category: 'Company & Industry Following',
    do: true,
    tip: 'Follow 20-30 companies you\'d like to work for, industry leaders, and thought leaders — stay updated on opportunities',
  },
  {
    category: 'Company & Industry Following',
    do: false,
    tip: 'Don\'t follow random accounts — be strategic and follow companies in your target domain',
  },
  // Banner Image
  {
    category: 'Banner/Hero Image',
    do: true,
    tip: 'Add a professional banner image that complements your brand and reflects your role/personality',
  },
  {
    category: 'Banner/Hero Image',
    do: false,
    tip: 'Don\'t leave default banner or use unprofessional/non-relevant images',
  },
  // Certifications & Credentials
  {
    category: 'Certifications',
    do: true,
    tip: 'Add all relevant certifications (AWS, GCP, Azure, Google, Coursera) with dates and verification links',
  },
  {
    category: 'Certifications',
    do: false,
    tip: 'Don\'t skip certifications even if they\'re not required — they signal continuous upskilling',
  },
  // Open to Opportunities
  {
    category: 'Job Preferences',
    do: true,
    tip: 'Use "Open to work" feature and specify: roles, job types (full-time, contract), locations, and workplace type',
  },
  {
    category: 'Job Preferences',
    do: false,
    tip: 'Don\'t leave job preferences vague or be "open to anything" — recruiters want specific candidates',
  },
  // Activity Status
  {
    category: 'Profile Activity',
    do: true,
    tip: 'Stay active by engaging: commenting on posts, resharing relevant content, and updating profile regularly',
  },
  {
    category: 'Profile Activity',
    do: false,
    tip: 'Don\'t let profile go stale — active profiles appear in recruiter recommendations more frequently',
  },
  // Volunteer Work
  {
    category: 'Volunteer & Causes',
    do: true,
    tip: 'Add volunteer work, side projects, and causes you care about — shows well-rounded personality to recruiters',
  },
  {
    category: 'Volunteer & Causes',
    do: false,
    tip: 'Don\'t ignore volunteer section if you have relevant community work or passion projects',
  },
];

/* Tip Card Component */
function TipCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3.5 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
    >
      <div className="flex items-start gap-2.5">
        {item.do ? (
          <FiCheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
        ) : (
          <FiAlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-bold uppercase tracking-wide ${item.do ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {item.do ? '✓ DO' : '✗ DON\'T'}
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">
            {item.tip}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* Category Section Component */
function CategorySection({ category, tips, platformColor }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const getColorClass = () => {
    if (platformColor === 'red') return 'from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border-red-200 dark:border-red-800';
    return 'from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 border-sky-200 dark:border-sky-800';
  };

  const getIconColor = () => platformColor === 'red' ? 'bg-red-500' : 'bg-sky-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${getColorClass()} border rounded-xl overflow-hidden`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-2 h-2 ${getIconColor()} rounded-full flex-shrink-0`}></div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {category}
          </h4>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-200/50 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-medium flex-shrink-0">
            {tips.length} tips
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          {isOpen ? (
            <FiChevronUp size={18} className="text-slate-500" />
          ) : (
            <FiChevronDown size={18} className="text-slate-500" />
          )}
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden border-t border-slate-200 dark:border-slate-700/50"
      >
        <div className="px-4 py-3 space-y-2.5">
          {tips.map((item, idx) => (
            <TipCard key={idx} item={item} index={idx} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Group tips by category
function groupTipsByCategory(tips) {
  return tips.reduce((acc, tip, idx) => {
    const cat = tip.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ ...tip, index: idx });
    return acc;
  }, {});
}

export default function SocialMediaOptimisation() {
  const naukriByCategory = groupTipsByCategory(naukriTips);
  const linkedinByCategory = groupTipsByCategory(linkedinTips);
  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center shadow-lg">
            <FiShare2 size={22} className="text-white" />
          </div>
          <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Social Media Optimisation</h1>
            <p className="text-slate-500 text-sm">Maximize your recruiter visibility on Naukri & LinkedIn</p>
          </div>
        </div>
      </motion.div>

      {/* Tips sections side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Naukri Tips */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center shadow-lg">
              <FiShare2 size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Naukri.com</h2>
              <p className="text-xs text-slate-500 mt-0.5">{Object.keys(naukriByCategory).length} categories · {naukriTips.length} suggestions</p>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(naukriByCategory).map(([category, tips]) => (
              <CategorySection key={category} category={category} tips={tips} platformColor="red" />
            ))}
          </div>
        </motion.div>

        {/* LinkedIn Tips */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
              <FiLinkedin size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">LinkedIn</h2>
              <p className="text-xs text-slate-500 mt-0.5">{Object.keys(linkedinByCategory).length} categories · {linkedinTips.length} suggestions</p>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(linkedinByCategory).map(([category, tips]) => (
              <CategorySection key={category} category={category} tips={tips} platformColor="sky" />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
      >
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
          <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">📌 Naukri Success Tips</p>
          <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
            Focus on keyword optimization, regular profile updates, and maintaining 100% profile completion. Naukri's search algorithm heavily rewards recently updated profiles with complete information.
          </p>
        </div>
        <div className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-200 dark:border-sky-800 rounded-xl p-5">
          <p className="text-sm font-semibold text-sky-900 dark:text-sky-200 mb-2">📌 LinkedIn Success Tips</p>
          <p className="text-xs text-sky-700 dark:text-sky-300 leading-relaxed">
            Build your professional brand through content, authentic recommendations, and genuine connections. LinkedIn prioritizes activity and engagement — the more active you are, the more visible you become.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
