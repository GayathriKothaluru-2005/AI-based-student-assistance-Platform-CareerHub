import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiArrowRight,
  FiUpload,
  FiFile,
  FiCheckCircle,
  FiX,
  FiDownload,
  FiUser,
  FiCode,
  FiBriefcase,
  FiBook,
  FiAward,
  FiEdit3,
  FiZap,
  FiAlertCircle,
} from 'react-icons/fi';
import api from '../../utils/api';
import { downloadAsPDF, downloadAsDoc } from '../../utils/resumeDownload';
import TemplatePreviewCard from '../../components/TemplatePreviewCard';

const STEPS = ['Upload Resume', 'AI Processing', 'Review Extracted Data', 'Edit & Refine', 'Choose Template & Download'];

const templates = [
  { id: 'minimal', name: 'Minimal ATS', gradient: 'from-slate-600 to-slate-800' },
  { id: 'sidebar', name: 'Modern Sidebar', gradient: 'from-blue-600 to-blue-800' },
  { id: 'creative', name: 'Creative', gradient: 'from-purple-600 to-pink-600' },
  { id: 'professional', name: 'Professional', gradient: 'from-cyan-600 to-teal-700' },
];

/* ─── Animated AI processing dots ─── */
function ProcessingDot({ delay }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, delay }}
      className="w-3 h-3 rounded-full bg-blue-500"
    />
  );
}

/* ─── Extracted Section Card ─── */
function ExtractedCard({ icon: Icon, title, items, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl bg-slate-800/60 border border-slate-700`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-sm text-white">{title}</h3>
        <FiCheckCircle className="w-4 h-4 text-green-400 ml-auto" />
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <p key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
            <span className="text-green-400 mt-0.5">✓</span> {item}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

export default function ResumeParser() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [editableData, setEditableData] = useState(null);
  const [parseError, setParseError] = useState('');

  const handleFile = (f) => {
    if (!f) return;
    const valid = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!valid.includes(f.type)) { alert('Please upload a PDF or Word document.'); return; }
    setFile(f);
    setParseError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const startProcessing = async () => {
    setStep(1);
    setParseError('');

    const stages = [
      { label: 'Extracting text from document...', pct: 20 },
      { label: 'Identifying sections & structure...', pct: 45 },
      { label: 'Parsing personal information...', pct: 62 },
      { label: 'Extracting skills & experience...', pct: 80 },
      { label: 'Finalizing resume data...', pct: 95 },
    ];

    // Run progress animation
    const animateStages = () =>
      new Promise((resolve) => {
        let i = 0;
        const run = () => {
          if (i < stages.length) {
            setProcessingProgress(stages[i].pct);
            setProcessingStage(stages[i].label);
            i++;
            setTimeout(run, 800);
          } else {
            resolve();
          }
        };
        run();
      });

    // Send file to backend
    const formData = new FormData();
    formData.append('resume', file);
    const apiCall = api.post('/resume/parse', formData, {
      headers: { 'Content-Type': undefined },
    });

    try {
      // Wait for both animation and API to finish
      const [, response] = await Promise.all([animateStages(), apiCall]);
      setProcessingProgress(100);
      setProcessingStage('Done!');
      setTimeout(() => {
        setExtractedData(response.data.data);
        setEditableData(JSON.parse(JSON.stringify(response.data.data)));
        setStep(2);
      }, 400);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to parse resume. Please try a different file.';
      setParseError(msg);
      setStep(0);
    }
  };

  const inputCls = 'w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <motion.button
            whileHover={{ x: -3 }}
            onClick={() => navigate('/resume-builder')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-base font-bold">Resume Parser</h1>
            <p className="text-xs text-slate-500">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-800">
        <motion.div
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* ── STEP 0: Upload ── */}
          {step === 0 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                  <FiUpload className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Upload Your Resume</h2>
                <p className="text-slate-400">Our AI will extract and structure all your information automatically.</p>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-500/10 scale-105'
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
                    <p className="text-sm text-slate-500">or click to browse files</p>
                    <p className="text-xs text-slate-600 mt-3">Supports PDF, DOC, DOCX • Max 5MB</p>
                  </div>
                )}
              </div>

              {/* Format info */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: 'PDF', desc: 'Best quality', icon: '📄' },
                  { label: 'DOC', desc: 'Word format', icon: '📝' },
                  { label: 'DOCX', desc: 'Modern Word', icon: '📋' },
                ].map((f) => (
                  <div key={f.label} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                    <div className="text-xl mb-1">{f.icon}</div>
                    <p className="text-xs font-semibold text-white">{f.label}</p>
                    <p className="text-xs text-slate-500">{f.desc}</p>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startProcessing}
                disabled={!file}
                className={`w-full mt-6 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                  file
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800 cursor-not-allowed text-slate-500'
                }`}
              >
                <FiZap className="w-5 h-5" /> Parse with AI
                <FiArrowRight className="w-4 h-4" />
              </motion.button>

              {parseError && (
                <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  {parseError}
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 1: Processing ── */}
          {step === 1 && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto text-center py-12"
            >
              <div className="relative w-28 h-28 mx-auto mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border-4 border-purple-500/20 border-t-purple-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiZap className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-3">AI is Parsing Your Resume</h2>
              <p className="text-blue-400 font-medium mb-6 min-h-[20px]">{processingStage}</p>

              <div className="w-full bg-slate-800 rounded-full h-3 mb-4">
                <motion.div
                  animate={{ width: `${processingProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>
              <p className="text-slate-500 text-sm">{processingProgress}% complete</p>

              <div className="flex justify-center gap-2 mt-8">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <ProcessingDot key={i} delay={delay} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Extracted Data Preview ── */}
          {step === 2 && extractedData && (
            <motion.div
              key="extracted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4"
                >
                  <FiCheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Extraction Complete!</h2>
                <p className="text-slate-400">Review the extracted information before editing.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <ExtractedCard
                  icon={FiUser}
                  title="Personal Info"
                  color="from-blue-500 to-blue-700"
                  items={[
                    extractedData.personal.name,
                    extractedData.personal.email,
                    extractedData.personal.phone,
                    extractedData.personal.location,
                  ].filter(Boolean)}
                />
                <ExtractedCard
                  icon={FiBook}
                  title="Education"
                  color="from-purple-500 to-purple-700"
                  items={extractedData.education.map((e) => `${e.degree} — ${e.institution}`)}
                />
                <ExtractedCard
                  icon={FiCode}
                  title="Skills"
                  color="from-cyan-500 to-cyan-700"
                  items={[
                    `Technical: ${extractedData.skills.technical?.slice(0, 50)}...`,
                    `Tools: ${extractedData.skills.tools?.slice(0, 40)}...`,
                  ]}
                />
                <ExtractedCard
                  icon={FiBriefcase}
                  title="Experience"
                  color="from-orange-500 to-orange-700"
                  items={extractedData.experience.map((e) => `${e.role} @ ${e.company}`)}
                />
                <ExtractedCard
                  icon={FiUser}
                  title={`Projects (${extractedData.projects.length})`}
                  color="from-green-500 to-green-700"
                  items={extractedData.projects.map((p) => p.name)}
                />
                <ExtractedCard
                  icon={FiAward}
                  title={`Certifications (${extractedData.certifications.length})`}
                  color="from-yellow-500 to-yellow-700"
                  items={extractedData.certifications.map((c) => c.name)}
                />
              </div>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
                >
                  <FiEdit3 className="w-4 h-4" /> Edit & Refine <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Edit ── */}
          {step === 3 && editableData && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">Edit Extracted Data</h2>
                <p className="text-slate-400 text-sm">Correct any mistakes or add missing information.</p>
              </div>

              <div className="space-y-6">
                {/* Personal */}
                <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
                  <h3 className="font-semibold text-blue-400 mb-4 flex items-center gap-2">
                    <FiUser className="w-4 h-4" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['name', 'email', 'phone', 'location'].map((f) => (
                      <div key={f}>
                        <label className="block text-xs text-slate-400 mb-1 capitalize">{f}</label>
                        <input
                          type="text"
                          value={editableData.personal[f]}
                          onChange={(e) =>
                            setEditableData((d) => ({ ...d, personal: { ...d.personal, [f]: e.target.value } }))
                          }
                          className={inputCls}
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1">Summary</label>
                      <textarea
                        value={editableData.personal.summary}
                        onChange={(e) =>
                          setEditableData((d) => ({ ...d, personal: { ...d.personal, summary: e.target.value } }))
                        }
                        rows={3}
                        className={inputCls + ' resize-none'}
                      />
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
                  <h3 className="font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                    <FiCode className="w-4 h-4" /> Skills
                  </h3>
                  {['technical', 'soft', 'tools'].map((f) => (
                    <div key={f} className="mb-3">
                      <label className="block text-xs text-slate-400 mb-1 capitalize">{f} Skills</label>
                      <input
                        type="text"
                        value={editableData.skills[f]}
                        onChange={(e) =>
                          setEditableData((d) => ({ ...d, skills: { ...d.skills, [f]: e.target.value } }))
                        }
                        className={inputCls}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <motion.button
                  whileHover={{ x: -3 }}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium"
                >
                  <FiArrowLeft className="w-4 h-4" /> Back
                </motion.button>
                <motion.button
                  whileHover={{ x: 3 }}
                  onClick={() => setStep(4)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold"
                >
                  Next <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: Template & Download ── */}
          {step === 4 && (
            <motion.div
              key="template"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">Choose Template & Download</h2>
                <p className="text-slate-400 text-sm">Pick a template and export your finalized resume.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
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

              <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiCheckCircle className="w-5 h-5 text-green-400" />
                  <p className="font-semibold text-white">Resume Ready!</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div>✓ Personal info populated</div>
                  <div>✓ Skills extracted</div>
                  <div>✓ Projects included</div>
                  <div>✓ Experience added</div>
                  <div>✓ Education details</div>
                  <div>✓ Certifications listed</div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => downloadAsPDF(editableData, selectedTemplate)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold"
                >
                  <FiDownload className="w-4 h-4" /> Download PDF
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => downloadAsDoc(editableData, selectedTemplate)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold"
                >
                  <FiDownload className="w-4 h-4" /> Download DOCX
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
