import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMap, FiLoader, FiAlertCircle, FiChevronDown, FiChevronUp, FiZap,
  FiDownload
} from 'react-icons/fi';
import api from '../../utils/api';
import { downloadAsPDF, generateRoadmapPDF } from '../../utils/downloadUtils';

const EXAMPLE_TOPICS = [
  'React', 'Python', 'Machine Learning', 'System Design',
  'DevOps', 'SQL', 'Node.js', 'Cybersecurity',
];

/* ─── Collapsible stage card ─── */
function StageCard({ title, modules, gradient }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${gradient}`}>
            {title}
          </span>
          <span className="text-xs text-slate-500">{modules.length} modules</span>
        </div>
        {open ? <FiChevronUp size={16} className="text-slate-400" /> : <FiChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && (
        <div className="px-5 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
          {modules.map((mod, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
              <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{mod.topic}</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-2">{mod.explanation}</p>
              {mod.tools?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {mod.tools.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] border border-slate-200 dark:border-slate-600 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RoadmapGeneratorComponent() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const generate = async (topicInput) => {
    const t = (topicInput || topic).trim();
    if (!t) { setError('Please enter a topic.'); return; }
    setTopic(t);
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.post('/roadmap/generate', { topic: t });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadRoadmapPDF = async () => {
    if (!result) return;
    const html = generateRoadmapPDF(result);
    await downloadAsPDF(html, `Learning_Roadmap_${result.topic.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Input card */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
            <FiMap size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xl">Learning Roadmap Generator</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Powered by Groq AI · Generate personalized learning paths</p>
          </div>
        </div>

        <div className="flex gap-3 mb-5">
          <input
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && generate()}
            placeholder="Enter a topic (e.g. React, Machine Learning, System Design...)"
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-5 py-3 text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 transition-all"
          />
          <button
            onClick={() => generate()}
            disabled={loading || !topic.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold hover:from-indigo-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg active:scale-95 flex-shrink-0"
          >
            {loading
              ? <><FiLoader size={16} className="animate-spin" /> Generating...</>
              : <><FiZap size={16} /> Generate</>
            }
          </button>
        </div>

        {/* Example chips */}
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest">Quick Topics</p>
          <div className="flex flex-wrap gap-2.5">
            {EXAMPLE_TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => generate(t)}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800/50"
          >
            <FiAlertCircle size={16} />
            <span>{error}</span>
          </motion.p>
        )}
      </div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header with Download */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">📚 Learning Roadmap</h2>
                <p className="text-indigo-100 text-lg mb-1" style={{fontSize: '1.25rem', fontWeight: '600'}}>
                  <span className="text-white">{result.topic}</span>
                </p>
                <p className="text-indigo-100 text-sm">Complete step-by-step learning path from basics to advanced</p>
              </div>
              
              {/* Download Button - Prominent */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadRoadmapPDF}
                className="flex flex-col items-center gap-2 px-8 py-5 bg-white text-indigo-600 font-bold rounded-xl transition-all hover:shadow-2xl active:scale-95 flex-shrink-0 hover:bg-indigo-50"
              >
                <FiDownload size={24} />
                <span className="text-sm">Download PDF</span>
              </motion.button>
            </div>
          </div>

          {/* Stages */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold text-lg">1</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Beginner Level</h3>
                <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">Foundation</span>
              </div>
              <StageCard title="Beginner" modules={result.roadmap.beginner || []} gradient="from-green-500 to-emerald-500" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-lg">2</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Intermediate Level</h3>
                <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">Building Skills</span>
              </div>
              <StageCard title="Intermediate" modules={result.roadmap.intermediate || []} gradient="from-amber-500 to-orange-500" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold text-lg">3</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Advanced Level</h3>
                <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold">Mastery</span>
              </div>
              <StageCard title="Advanced" modules={result.roadmap.advanced || []} gradient="from-red-500 to-rose-500" />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center justify-center gap-2">
              <FiZap size={12} /> Powered by Groq LLaMA 3.3 70B
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
