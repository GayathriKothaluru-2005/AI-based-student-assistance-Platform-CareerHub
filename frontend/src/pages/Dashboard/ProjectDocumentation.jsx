import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFolder,
  FiGitBranch,
  FiLayers,
  FiArrowRight,
  FiChevronDown,
  FiCheck,
  FiCode,
  FiClock,
  FiTarget,
  FiBook,
  FiLink,
  FiPlay,
} from 'react-icons/fi';
import api from '../../utils/api';

const TechStackOptions = {
  frontend: [
    'HTML/CSS/JavaScript',
    'React',
    'Vue.js',
    'Angular',
    'Next.js',
    'Svelte',
    'React Native',
    'Flutter',
    'TypeScript',
  ],
  backend: [
    'Python',
    'Java',
    'Node.js/Express',
    'Django',
    'Flask',
    'Spring Boot',
    'FastAPI',
    'Go',
    'Ruby on Rails',
    'C#/.NET',
    'PHP/Laravel',
  ],
  database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Redis', 'Cassandra', 'Oracle', 'SQLite'],
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1 } }),
};

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all"
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className={`p-4 cursor-pointer transition-all ${
          expanded
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
            : 'bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  expanded
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-500 dark:bg-blue-600 text-white'
                }`}
              >
                {index + 1}
              </span>
              <h3
                className={`font-bold text-lg ${
                  expanded ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}
              >
                {project.name}
              </h3>
            </div>
            <p
              className={`text-sm ${
                expanded ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {project.description}
            </p>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
            <FiChevronDown
              size={20}
              className={expanded ? 'text-white' : 'text-slate-400'}
            />
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Difficulty</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {project.difficulty}
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Timeline</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FiClock size={12} /> {project.estimatedTime}
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Features</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {project.features.length}+
                  </p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <FiTarget size={14} /> Key Features
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {project.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <FiCheck size={14} className="text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Building Steps */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiCode size={14} /> Building Steps
                </h4>
                <div className="space-y-2">
                  {project.buildingSteps.map((step, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-slate-800/50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {step.step}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white text-sm">
                            {step.title}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <FiBook size={14} /> Learning Outcomes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.learningOutcomes.map((outcome, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium"
                    >
                      {outcome}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <FiLink size={14} /> Resources & Links
                </h4>
                <div className="space-y-1.5">
                  {project.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition group"
                    >
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                        {resource.title}
                      </p>
                      <FiArrowRight size={14} className="text-blue-400 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Start Project Button */}
              <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <FiPlay size={16} /> Start Building This Project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProjectDocumentation() {
  const [step, setStep] = useState('form'); // 'form' or 'results'
  const [skillLevel, setSkillLevel] = useState('');
  const [frontendStack, setFrontendStack] = useState('');
  const [backendStack, setBackendStack] = useState('');
  const [database, setDatabase] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStacks, setSelectedStacks] = useState({ frontend: false, backend: false, db: false });

  const handleGenerateProjects = async (e) => {
    e.preventDefault();
    setError('');

    if (!skillLevel || !frontendStack || !backendStack || !database) {
      setError('Please select all options before generating projects');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/project-generator/generate', {
        skillLevel,
        frontendStack,
        backendStack,
        database,
      });

      if (response.data.success) {
        setProjects(response.data.projects);
        setStep('results');
      } else {
        setError(response.data.message || 'Failed to generate projects');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error generating projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('form');
    setSkillLevel('');
    setFrontendStack('');
    setBackendStack('');
    setDatabase('');
    setProjects([]);
    setError('');
    setSelectedStacks({ frontend: false, backend: false, db: false });
  };

  if (step === 'form') {
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
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
              <FiGitBranch size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Project Idea Generator</h1>
              <p className="text-slate-500 text-sm">Get AI-powered project recommendations based on your skills and tech stack</p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleGenerateProjects}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8"
        >
          {/* Skill Level Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <FiTarget size={18} /> Step 1: Select Your Skill Level
            </h2>
            <p className="text-slate-500 text-sm mb-4">Choose your experience level</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Beginner', 'Moderate', 'Expert'].map((level) => (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setSkillLevel(level)}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold ${
                    skillLevel === level
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {level === 'Beginner' && '🌱 Beginner'}
                  {level === 'Moderate' && '🔥 Moderate'}
                  {level === 'Expert' && '🚀 Expert'}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Frontend Stack Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <FiCode size={18} /> Step 2: Frontend Technology
            </h2>
            <p className="text-slate-500 text-sm mb-4">Choose your preferred frontend framework/language</p>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSelectedStacks({ ...selectedStacks, frontend: !selectedStacks.frontend })}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700"
              >
                <span>{frontendStack || 'Select frontend technology...'}</span>
                <FiChevronDown
                  size={18}
                  className={`transition-transform ${selectedStacks.frontend ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {selectedStacks.frontend && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="max-h-60 overflow-y-auto">
                      {TechStackOptions.frontend.map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => {
                            setFrontendStack(tech);
                            setSelectedStacks({ ...selectedStacks, frontend: false });
                          }}
                          className="w-full px-4 py-3 text-left text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Backend Stack Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <FiLayers size={18} /> Step 3: Backend Technology
            </h2>
            <p className="text-slate-500 text-sm mb-4">Choose your preferred backend framework/language</p>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSelectedStacks({ ...selectedStacks, backend: !selectedStacks.backend })}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700"
              >
                <span>{backendStack || 'Select backend technology...'}</span>
                <FiChevronDown
                  size={18}
                  className={`transition-transform ${selectedStacks.backend ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {selectedStacks.backend && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="max-h-60 overflow-y-auto">
                      {TechStackOptions.backend.map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => {
                            setBackendStack(tech);
                            setSelectedStacks({ ...selectedStacks, backend: false });
                          }}
                          className="w-full px-4 py-3 text-left text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Database Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <FiFolder size={18} /> Step 4: Database
            </h2>
            <p className="text-slate-500 text-sm mb-4">Choose your preferred database</p>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSelectedStacks({ ...selectedStacks, db: !selectedStacks.db })}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700"
              >
                <span>{database || 'Select database...'}</span>
                <FiChevronDown
                  size={18}
                  className={`transition-transform ${selectedStacks.db ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {selectedStacks.db && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="max-h-60 overflow-y-auto">
                      {TechStackOptions.database.map((db) => (
                        <button
                          key={db}
                          type="button"
                          onClick={() => {
                            setDatabase(db);
                            setSelectedStacks({ ...selectedStacks, db: false });
                          }}
                          className="w-full px-4 py-3 text-left text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                        >
                          {db}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !skillLevel || !frontendStack || !backendStack || !database}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Projects...
              </>
            ) : (
              <>
                <FiArrowRight size={18} />
                Generate {skillLevel} Level Projects
              </>
            )}
          </motion.button>

          {/* Selection Summary */}
          {skillLevel && frontendStack && backendStack && database && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <span className="font-bold">Your Selection:</span> {skillLevel} developer with {frontendStack} →
                {backendStack} → {database}
              </p>
            </motion.div>
          )}
        </motion.form>
      </div>
    );
  }

  // Results View
  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Top 10 Project Ideas for You
          </h1>
          <p className="text-slate-500 text-sm">
            {skillLevel} • {frontendStack} • {backendStack} • {database}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition"
        >
          ← Back
        </motion.button>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project, i) => (
          <motion.div key={project.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <ProjectCard project={project} index={i} />
          </motion.div>
        ))}
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border border-violet-200 dark:border-violet-800 rounded-xl"
      >
        <h3 className="font-semibold text-violet-900 dark:text-violet-300 mb-3">💡 Project Building Tips</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-violet-800 dark:text-violet-200">
          <li>✓ Start with step 1 and follow in order</li>
          <li>✓ Don't skip fundamentals - they matter</li>
          <li>✓ Test as you build</li>
          <li>✓ Use version control (Git)</li>
          <li>✓ Deploy early to get feedback</li>
          <li>✓ Document your project as you build</li>
        </ul>
      </motion.div>
    </div>
  );
}

