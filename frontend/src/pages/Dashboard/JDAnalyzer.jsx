import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFileText, FiSearch, FiMap, FiMessageSquare,
  FiUpload, FiX, FiSend, FiCpu, FiUser, FiLoader,
  FiCheckCircle, FiAlertCircle, FiChevronDown, FiChevronUp,
  FiClipboard, FiTarget, FiDownload
} from 'react-icons/fi';
import api from '../../utils/api';
import { downloadAsPDF, generateJDReportPDF } from '../../utils/downloadUtils';

/* ─── Tab definitions ─── */
const TABS = [
  { id: 'analyze', label: 'Analyze JD', icon: FiSearch },
  { id: 'skills', label: 'Skill Gap', icon: FiTarget },
  { id: 'roadmap', label: 'Learning Roadmap', icon: FiMap },
  { id: 'chat', label: 'AI Chat', icon: FiMessageSquare },
];

/* ─── Difficulty badge ─── */
function DifficultyBadge({ level }) {
  const map = {
    Easy: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40',
    Medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
    Hard: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[level] || map['Medium']}`}>
      {level}
    </span>
  );
}

/* ─── Chip ─── */
function Chip({ label, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800/30',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800/30',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-100 dark:border-red-800/30',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800/30',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800/30',
  };
  return (
    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium border ${colors[color] || colors.blue}`}>
      {label}
    </span>
  );
}

/* ─── Match gauge ─── */
function MatchGauge({ percent }) {
  const color = percent >= 70 ? '#22c55e' : percent >= 40 ? '#f59e0b' : '#ef4444';
  const r = 42;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg width="112" height="112" viewBox="0 0 112 112" className="rotate-[-90deg]">
          <circle cx="56" cy="56" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" className="dark:[stroke:#334155]" />
          <motion.circle
            cx="56" cy="56" r={r} fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${(percent / 100) * circ} ${circ}` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{percent}%</span>
          <span className="text-xs text-slate-500">Match</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Collapsible roadmap phase ─── */
function PhaseCard({ phase }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {phase.phase}
          </span>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">{phase.title}</p>
            <p className="text-xs text-slate-500">{phase.duration}</p>
          </div>
        </div>
        {open ? <FiChevronUp size={16} className="text-slate-400" /> : <FiChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
          {phase.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {phase.skills.map((s) => <Chip key={s} label={s} color="blue" />)}
            </div>
          )}
          {phase.tasks?.length > 0 && (
            <ul className="space-y-1.5">
              {phase.tasks.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <FiCheckCircle size={13} className="text-green-500 mt-0.5 flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          )}
          {phase.resources?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Resources</p>
              <div className="flex flex-wrap gap-2">
                {phase.resources.map((r, i) => (
                  r.url && r.url.startsWith('http') ? (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:underline border border-slate-200 dark:border-slate-700">
                      {r.name}
                    </a>
                  ) : (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {r.name}
                    </span>
                  )
                ))}
              </div>
            </div>
          )}
          {phase.milestone && (
            <p className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg px-3 py-2">
              🎯 Milestone: {phase.milestone}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   TAB 1 — Analyze JD
══════════════════════════════════ */
function AnalyzeTab() {
  const [jdText, setJdText] = useState('');
  const [mode, setMode] = useState('student');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { setError('Only PDF files are supported.'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('File size must be under 5 MB.'); return; }
    setFile(f);
    setJdText('');
    setError('');
  };

  const handleAnalyze = async () => {
    if (!jdText.trim() && !file) { setError('Please paste a job description or upload a PDF.'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      if (file) formData.append('jdFile', file);
      else formData.append('jdText', jdText);
      formData.append('mode', mode);
      const { data } = await api.post('/jd/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const s = result?.summary;
  const k = result?.keywords;

  return (
    <div className="space-y-5">
      {/* Input area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Job Description Input</h3>
          <div className="flex gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {['student', 'professional'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                  mode === m
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* File upload */}
        {file ? (
          <div className="flex items-center gap-3 mb-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
            <FiFileText size={18} className="text-blue-500" />
            <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 transition-colors">
              <FiX size={15} />
            </button>
          </div>
        ) : (
          <textarea
            rows={6}
            value={jdText}
            onChange={(e) => { setJdText(e.target.value); setError(''); }}
            placeholder="Paste the job description here..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 resize-none mb-3"
          />
        )}

        <div className="flex items-center gap-3">
          <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm hover:border-blue-400 hover:text-blue-500 transition-all"
          >
            <FiUpload size={14} /> Upload PDF
          </button>
          <button
            onClick={handleAnalyze}
            disabled={loading || (!jdText.trim() && !file)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <><FiLoader size={14} className="animate-spin" /> Analyzing...</> : <><FiSearch size={14} /> Analyze JD</>}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <FiAlertCircle size={14} /> {error}
          </p>
        )}
      </div>

      {/* Results */}
      {s && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Overview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white">Role Overview</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{s.roleType}</span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-500">{s.experienceLevel}</span>
                <DifficultyBadge level={s.difficultyMeter} />
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3">{s.roleOverview}</p>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{s.simpleSummary}</p>
            {s.salaryRange && s.salaryRange !== 'Not specified' && (
              <p className="mt-3 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-800/30 inline-block">
                💰 Estimated: {s.salaryRange}
              </p>
            )}
            {s.difficultyReason && (
              <p className="mt-2 text-xs text-slate-500">{s.difficultyReason}</p>
            )}
          </div>

          {/* Skills grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {(s.requiredSkills || []).map((sk) => <Chip key={sk} label={sk} color="blue" />)}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Tools & Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {(s.toolsAndTech || []).map((t) => <Chip key={t} label={t} color="purple" />)}
              </div>
            </div>
          </div>

          {/* Keywords */}
          {k && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                <FiClipboard size={14} className="text-amber-500" /> ATS Keywords for Your Resume
              </h4>
              <div className="space-y-3">
                {k.mustHaveKeywords?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1.5 font-medium">Must-Have</p>
                    <div className="flex flex-wrap gap-1.5">
                      {k.mustHaveKeywords.map((kw) => <Chip key={kw} label={kw} color="red" />)}
                    </div>
                  </div>
                )}
                {k.technicalKeywords?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1.5 font-medium">Technical</p>
                    <div className="flex flex-wrap gap-1.5">
                      {k.technicalKeywords.map((kw) => <Chip key={kw} label={kw} color="blue" />)}
                    </div>
                  </div>
                )}
                {k.resumeTips?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {k.resumeTips.map((tip, i) => (
                      <p key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5">💡</span>{tip}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   TAB 2 — Skill Gap
══════════════════════════════════ */
function SkillGapTab() {
  const [jdText, setJdText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleMatch = async () => {
    if (!jdText.trim()) { setError('Please paste the job description.'); return; }
    if (!resumeText.trim()) { setError('Please paste your resume text.'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.post('/jd/match-skills', { jdText, resumeText });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadJDPDF = async () => {
    if (!result) return;
    const html = generateJDReportPDF({ jdText, analysis: result });
    await downloadAsPDF(html, 'JD_Analysis_Report.pdf');
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Job Description</h3>
          <textarea
            rows={8}
            value={jdText}
            onChange={(e) => { setJdText(e.target.value); setError(''); }}
            placeholder="Paste the job description here..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none"
          />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Your Resume</h3>
          <textarea
            rows={8}
            value={resumeText}
            onChange={(e) => { setResumeText(e.target.value); setError(''); }}
            placeholder="Paste your resume text here..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleMatch}
          disabled={loading || !jdText.trim() || !resumeText.trim()}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? <><FiLoader size={14} className="animate-spin" /> Analyzing...</> : <><FiTarget size={14} /> Analyze Skill Gap</>}
        </button>
        {error && <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"><FiAlertCircle size={13} />{error}</p>}
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header with Match Score & Download */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <MatchGauge percent={result.matchPercentage || 0} />
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">
                    {result.matchPercentage >= 70 ? '🎉 Strong Match!' : result.matchPercentage >= 40 ? '⚠️ Moderate Match' : '📈 Room to Grow'}
                  </h2>
                  <p className="text-purple-100 text-base">{result.overallVerdict}</p>
                </div>
              </div>
              
              {/* Download Button - Prominent */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadJDPDF}
                className="flex flex-col items-center gap-2 px-8 py-5 bg-white text-purple-600 font-bold rounded-xl transition-all hover:shadow-2xl active:scale-95 flex-shrink-0 hover:bg-purple-50"
              >
                <FiDownload size={24} />
                <span className="text-sm">Download PDF</span>
              </motion.button>
            </div>
          </div>

          {/* Skills Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Matched Skills */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white text-lg">✓</div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Your Strengths</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Matched Skills</p>
                </div>
              </div>
              <div className="space-y-2">
                {(result.matchedSkills || []).length > 0 ? (
                  result.matchedSkills.map((s) => (
                    <div key={s} className="px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-lg">
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">{s}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 p-3 text-center">No matched skills yet</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white text-lg">✕</div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Gaps to Address</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Priority Learning</p>
                </div>
              </div>
              <div className="space-y-2">
                {(result.missingSkills || []).length > 0 ? (
                  result.missingSkills.map((s) => (
                    <div key={s} className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
                      <p className="text-sm font-medium text-red-700 dark:text-red-400">{s}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 p-3 text-center">No skill gaps found!</p>
                )}
              </div>
            </div>

            {/* Nice to Have */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white text-lg">+</div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Nice to Have</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Additional Skills</p>
                </div>
              </div>
              <div className="space-y-2">
                {(result.niceToHaveSkills || []).length > 0 ? (
                  result.niceToHaveSkills.map((s) => (
                    <div key={s} className="px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-lg">
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-400">{s}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 p-3 text-center">None listed</p>
                )}
              </div>
            </div>
          </div>

          {result.suggestions?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Improvement Suggestions</h4>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-blue-500 mt-0.5">→</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   TAB 3 — Learning Roadmap (JD-based)
══════════════════════════════════ */
function RoadmapTab() {
  const [missingSkills, setMissingSkills] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    const skills = missingSkills.split(',').map((s) => s.trim()).filter(Boolean);
    if (skills.length === 0) { setError('Please enter at least one skill.'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.post('/jd/roadmap', { missingSkills: skills, jobTitle });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Generate Learning Roadmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-slate-500 font-medium mb-1.5 block">Missing Skills (comma-separated)</label>
            <input
              value={missingSkills}
              onChange={(e) => { setMissingSkills(e.target.value); setError(''); }}
              placeholder="e.g. React, Node.js, System Design"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-medium mb-1.5 block">Target Job Title (optional)</label>
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Full Stack Developer"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={loading || !missingSkills.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-sm font-medium hover:from-indigo-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <><FiLoader size={14} className="animate-spin" /> Generating...</> : <><FiMap size={14} /> Generate Roadmap</>}
          </button>
          {error && <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"><FiAlertCircle size={13} />{error}</p>}
        </div>
      </div>

      {result?.roadmap && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {result.jobTitle} — {result.roadmap.totalWeeks || '12'} Week Plan
            </h3>
            {result.roadmap.estimatedJobReadiness && (
              <span className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-200 dark:border-green-800/30">
                Ready by: {result.roadmap.estimatedJobReadiness}
              </span>
            )}
          </div>
          {(result.roadmap.phases || []).map((phase) => (
            <PhaseCard key={phase.phase} phase={phase} />
          ))}
          {result.roadmap.tips?.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-4">
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 text-sm mb-2">💡 Pro Tips</h4>
              <ul className="space-y-1">
                {result.roadmap.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-amber-700 dark:text-amber-400">• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   TAB 4 — AI Chat (JD-focused)
══════════════════════════════════ */
const JD_CHAT_WELCOME = { from: 'bot', text: "Hi! 👋 I'm your JD assistant. Ask me anything about specific job postings, required skills, salary expectations, or career growth for a particular role." };

function ChatTab() {
  const [messages, setMessages] = useState([JD_CHAT_WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const handleSend = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    const userMsg = { from: 'user', text: q };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setLoading(true);
    setError('');
    const history = [...messages, userMsg]
      .map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text }));
    try {
      const { data } = await api.post('/jd/chat', { question: q, history });
      setMessages((p) => [...p, { from: 'bot', text: data.answer }]);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden" style={{ height: '460px' }}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
              msg.from === 'bot' ? 'bg-gradient-to-br from-indigo-500 to-blue-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}>
              {msg.from === 'bot' ? <FiCpu size={14} className="text-white" /> : <FiUser size={14} className="text-white" />}
            </div>
            <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.from === 'bot'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm'
                : 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-tr-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <FiCpu size={14} className="text-white" />
            </div>
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                ))}
              </div>
            </div>
          </div>
        )}
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5 px-4">
            <FiAlertCircle size={13} />{error}
          </p>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 p-3 flex items-end gap-2">
        <textarea rows={1} value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask about skills, salaries, career paths..."
          className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 resize-none"
          style={{ maxHeight: '100px' }}
        />
        <button onClick={() => handleSend()} disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white hover:from-indigo-600 hover:to-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
          <FiSend size={16} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   Main JDAnalyzer page
══════════════════════════════════ */
export default function JDAnalyzer({ isEmbedded = false, onBack = null }) {
  const [activeTab, setActiveTab] = useState('analyze');

  return (
    <div className={isEmbedded ? 'p-0' : 'p-5 md:p-8 max-w-5xl mx-auto'}>
      {/* Back button if embedded */}
      {isEmbedded && onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <span>← Back to Career Tools</span>
        </button>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <FiFileText size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">JD Analyzer</h1>
            <p className="text-slate-500 text-sm">AI-powered job description analyzer — CareerLens</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'analyze' && <AnalyzeTab />}
          {activeTab === 'skills' && <SkillGapTab />}
          {activeTab === 'roadmap' && <RoadmapTab />}
          {activeTab === 'chat' && <ChatTab />}
        </motion.div>
      </AnimatePresence>

      <p className="text-slate-400 text-xs text-center mt-6">
        Powered by Groq LLaMA 3.3 70B · CareerLens JD Analyzer
      </p>
    </div>
  );
}
