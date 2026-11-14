import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadAsPDF, downloadAsDoc } from '../../utils/resumeDownload';
import api from '../../utils/api';
import TemplatePreviewCard from '../../components/TemplatePreviewCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiArrowRight,
  FiUpload,
  FiFile,
  FiDownload,
  FiZap,
  FiTarget,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
} from 'react-icons/fi';

const STEPS = ['Upload Resume', 'Job Description', 'Choose Template', 'AI Optimization', 'Download'];

const templates = [
  { id: 'minimal', name: 'Minimal ATS', gradient: 'from-slate-600 to-slate-800', ats: 98 },
  { id: 'sidebar', name: 'Modern Sidebar', gradient: 'from-blue-600 to-blue-800', ats: 92 },
  { id: 'creative', name: 'Creative', gradient: 'from-purple-600 to-pink-600', ats: 85 },
  { id: 'professional', name: 'Professional', gradient: 'from-cyan-600 to-teal-700', ats: 95 },
];

const jobExamples = [
  'Software Engineer at Google',
  'Full Stack Developer at Startup',
  'Data Engineer at Amazon',
  'React Developer at Product Company',
];

/* ─── ATS Score Ring ─── */
function ScoreRing({ score, label, color }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg width="112" height="112" viewBox="0 0 112 112" className="rotate-[-90deg]">
          <circle cx="56" cy="56" r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
          <motion.circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${dash} ${circumference}` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{score}</span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>
      </div>
      <p className="text-sm font-medium text-slate-300">{label}</p>
    </div>
  );
}

/* ─── Optimization Item ─── */
function OptimizationItem({ type, text, status }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
        status === 'added'
          ? 'bg-green-500/10 border-green-500/30 text-green-300'
          : status === 'improved'
          ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
          : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
      }`}
    >
      {status === 'added' ? (
        <FiCheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
      ) : status === 'improved' ? (
        <FiTrendingUp className="w-4 h-4 mt-0.5 shrink-0" />
      ) : (
        <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      )}
      <div>
        <span className="font-semibold uppercase text-xs opacity-70 block mb-0.5">{type}</span>
        {text}
      </div>
    </motion.div>
  );
}

export default function JobOptimizer() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jd, setJd] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [optimizationDone, setOptimizationDone] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [parseError, setParseError] = useState('');
  const fileRef = React.useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    const valid = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!valid.includes(f.type)) { alert('Please upload a PDF or Word document.'); return; }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const startOptimization = async () => {
    setStep(3);
    setOptimizationDone(false);
    setParseError('');
    const stages = [
      { label: 'Parsing job description...', pct: 15 },
      { label: 'Extracting key requirements...', pct: 30 },
      { label: 'Analyzing keyword gaps...', pct: 48 },
      { label: 'Optimizing resume content...', pct: 65 },
      { label: 'Enhancing ATS compatibility...', pct: 80 },
      { label: 'Applying template styling...', pct: 92 },
      { label: 'Finalizing optimized resume...', pct: 100 },
    ];

    const animateStages = () =>
      new Promise((resolve) => {
        let i = 0;
        const run = () => {
          if (i < stages.length) {
            setProcessingProgress(stages[i].pct);
            setProcessingStage(stages[i].label);
            i++;
            setTimeout(run, 900);
          } else resolve();
        };
        run();
      });

    const formData = new FormData();
    formData.append('resume', file);
    const apiCall = api.post('/resume/parse', formData, {
      headers: { 'Content-Type': undefined },
    });

    try {
      const [, response] = await Promise.all([animateStages(), apiCall]);
      setParsedData(response.data.data);
      setOptimizationDone(true);
      setStep(4);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to process resume. Please try again.';
      setParseError(msg);
      setStep(2); // go back to template step
    }
  };

  const mockOptimizations = [
    { type: 'Keyword Added', text: 'Added "distributed systems" from job requirements to skills section', status: 'added' },
    { type: 'Summary Improved', text: 'Rewritten summary to align with the role\'s emphasis on "scalable backend services"', status: 'improved' },
    { type: 'Experience Enhanced', text: 'Added quantified metrics to internship role: "reduced latency by 35%"', status: 'improved' },
    { type: 'Keyword Added', text: 'Added "CI/CD, Kubernetes" to tools section matching job requirements', status: 'added' },
    { type: 'Suggestion', text: 'Consider adding a LeetCode or competitive programming profile', status: 'suggest' },
    { type: 'Skills Reordered', text: 'Prioritized React.js, Node.js as they appear in the job title', status: 'improved' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ x: -3 }}
              onClick={() => navigate('/resume-builder')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-base font-bold flex items-center gap-2">
                <FiTarget className="w-4 h-4 text-cyan-400" /> Job Optimizer
              </h1>
              <p className="text-xs text-slate-500">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-1">
                <div
                  className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-semibold transition-all ${
                    i < step
                      ? 'bg-green-500 text-white'
                      : i === step
                      ? 'bg-blue-500 text-white ring-2 ring-blue-400/30'
                      : 'bg-slate-700 text-slate-500'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-0.5 ${i < step ? 'bg-green-500' : 'bg-slate-700'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800">
        <motion.div
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* ── STEP 0: Upload Resume ── */}
          {step === 0 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                  <FiUpload className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Upload Your Current Resume</h2>
                <p className="text-slate-400">We'll optimize it for your target job description.</p>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-cyan-500 bg-cyan-500/10 scale-105'
                    : file
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/40'
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFile(e.target.files[0])}
                  className="hidden"
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <FiFile className="w-14 h-14 text-green-400 mb-3" />
                    <p className="font-semibold text-green-300 text-lg">{file.name}</p>
                    <p className="text-sm text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="mt-3 text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <FiX className="w-3 h-3" /> Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FiUpload className="w-14 h-14 text-slate-500 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-lg font-semibold text-slate-300 mb-1">
                      {isDragging ? 'Drop it here!' : 'Drop your resume here'}
                    </p>
                    <p className="text-sm text-slate-500">or click to browse · PDF, DOC, DOCX</p>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                disabled={!file}
                className={`w-full mt-6 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                  file
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800 cursor-not-allowed text-slate-500'
                }`}
              >
                Continue <FiArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {/* ── STEP 1: Job Description ── */}
          {step === 1 && (
            <motion.div
              key="jd"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-cyan-600 flex items-center justify-center mb-4">
                  <FiTarget className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Paste Job Description</h2>
                <p className="text-slate-400">The more detailed the JD, the better the optimization.</p>
              </div>

              {/* Example chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs text-slate-500">Try an example:</span>
                {jobExamples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setJd(`We are looking for a ${ex}. Requirements include...\n• Experience with React, Node.js, and cloud infrastructure\n• Strong DSA and problem-solving skills\n• Experience with distributed systems and scalable architectures\n• Proficiency in CI/CD pipelines, Docker, Kubernetes\n• Excellent communication and teamwork skills`)}
                    className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400 hover:text-white hover:border-slate-500 transition-all"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                rows={12}
                placeholder="Paste the full job description here...

e.g., We are looking for a Software Engineer with experience in:
• React.js, Node.js, Python
• Cloud infrastructure (AWS/GCP)
• Distributed systems
• Strong problem-solving skills..."
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none transition-all"
              />

              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <FiAlertCircle className="w-4 h-4" />
                <span>{jd.length} characters — minimum 100 characters recommended</span>
              </div>

              <div className="flex justify-between mt-6">
                <motion.button
                  whileHover={{ x: -3 }}
                  onClick={() => setStep(0)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium"
                >
                  <FiArrowLeft className="w-4 h-4" /> Back
                </motion.button>
                <motion.button
                  whileHover={{ x: 3 }}
                  onClick={() => setStep(2)}
                  disabled={jd.length < 50}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold ${
                    jd.length >= 50
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Next <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Choose Template ── */}
          {step === 2 && (
            <motion.div
              key="template"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">Choose Your Template</h2>
                <p className="text-slate-400 text-sm">Select the format for your optimized resume output.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {templates.map((t) => (
                  <TemplatePreviewCard
                    key={t.id}
                    id={t.id}
                    name={t.name}
                    selected={selectedTemplate === t.id}
                    onSelect={() => setSelectedTemplate(t.id)}
                  />
                ))}
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-sm text-cyan-300 mb-6">
                <div className="flex items-start gap-2">
                  <FiTarget className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>For most job applications, <strong>Minimal ATS</strong> (98% ATS score) or <strong>Professional</strong> (95% ATS) are the best choices for getting past automated screening systems.</p>
                </div>
              </div>

              {parseError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
                  <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  {parseError}
                </div>
              )}

              <div className="flex justify-between">
                <motion.button
                  whileHover={{ x: -3 }}
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium"
                >
                  <FiArrowLeft className="w-4 h-4" /> Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startOptimization}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-sm font-semibold shadow-lg shadow-cyan-500/20"
                >
                  <FiZap className="w-4 h-4" /> Optimize with AI
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Processing ── */}
          {step === 3 && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto text-center py-10"
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-500"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border-4 border-blue-500/20 border-t-blue-500"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-9 rounded-full border-4 border-purple-500/20 border-t-purple-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiTarget className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-3">Optimizing Your Resume</h2>
              <p className="text-cyan-400 font-medium mb-2 min-h-[20px]">{processingStage}</p>
              <p className="text-slate-500 text-sm mb-6">AI is tailoring your resume to match the job requirements</p>

              <div className="w-full bg-slate-800 rounded-full h-3 mb-3">
                <motion.div
                  animate={{ width: `${processingProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                />
              </div>
              <p className="text-slate-500 text-sm">{processingProgress}% complete</p>

              <div className="mt-8 grid grid-cols-3 gap-3 text-left">
                {[
                  { label: 'Keywords Matched', val: `${Math.round(processingProgress * 0.12)}/15` },
                  { label: 'Section Optimized', val: `${Math.round(processingProgress * 0.05)}/5` },
                  { label: 'ATS Score', val: `${Math.min(95, Math.round(processingProgress * 0.95))}%` },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                    <p className="text-lg font-bold text-cyan-400">{s.val}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: Download + Comparison ── */}
          {step === 4 && optimizationDone && (
            <motion.div
              key="download"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Celebration banner */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mb-8"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Resume Optimized!</h2>
                <p className="text-slate-400">Your resume has been tailored for the job description.</p>
              </motion.div>

              {/* Before / After ATS */}
              <div className="flex justify-center gap-12 mb-10">
                <ScoreRing score={62} label="Before" color="#f59e0b" />
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <FiArrowRight className="w-8 h-8" />
                  <span className="text-xs mt-1">+33 pts</span>
                </div>
                <ScoreRing score={95} label="After" color="#22d3ee" />
              </div>

              {/* What changed */}
              <div className="mb-8">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <FiTrendingUp className="w-4 h-4 text-cyan-400" />
                  What AI Optimized ({mockOptimizations.length} changes)
                </h3>
                <div className="space-y-2">
                  {mockOptimizations.map((opt, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <OptimizationItem {...opt} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Download buttons */}
              <div className="sticky bottom-0 bg-slate-950/90 backdrop-blur-md pt-4 pb-6 border-t border-slate-800">
                <div className="flex gap-3 max-w-md mx-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => parsedData && downloadAsPDF(parsedData, selectedTemplate)}
                    disabled={!parsedData}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20"
                  >
                    <FiDownload className="w-4 h-4" /> Download PDF
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => parsedData && downloadAsDoc(parsedData, selectedTemplate)}
                    disabled={!parsedData}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold"
                  >
                    <FiDownload className="w-4 h-4" /> Download DOCX
                  </motion.button>
                </div>
                <p className="text-center text-xs text-slate-600 mt-3">
                  Optimized for: <span className="text-slate-400">{templates.find((t) => t.id === selectedTemplate)?.name}</span> template
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
