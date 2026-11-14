import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadAsPDF, downloadAsDoc } from '../../utils/resumeDownload';
import TemplatePreviewCard from '../../components/TemplatePreviewCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiArrowRight,
  FiPlus,
  FiTrash2,
  FiDownload,
  FiEye,
  FiCheckCircle,
  FiUser,
  FiBook,
  FiCode,
  FiBriefcase,
  FiAward,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiLinkedin,
  FiGithub,
} from 'react-icons/fi';

/* ─── Template definitions ─── */
const templates = [
  {
    id: 'minimal',
    name: 'Minimal ATS',
    description: 'Clean black & white, ATS-friendly',
    color: 'from-slate-600 to-slate-800',
    preview: 'bg-white',
    accent: '#1e293b',
  },
  {
    id: 'sidebar',
    name: 'Modern Sidebar',
    description: 'Two-column with colored left panel',
    color: 'from-blue-600 to-blue-800',
    preview: 'bg-blue-700',
    accent: '#2563eb',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Colorful highlights and modern typography',
    color: 'from-purple-600 to-pink-600',
    preview: 'bg-purple-700',
    accent: '#9333ea',
  },
  {
    id: 'professional',
    name: 'Professional Classic',
    description: 'Traditional layout trusted by recruiters',
    color: 'from-cyan-600 to-teal-700',
    preview: 'bg-teal-700',
    accent: '#0891b2',
  },
];

const STEPS = ['Choose Template', 'Personal Info', 'Education', 'Skills', 'Projects', 'Experience', 'Certifications', 'Preview & Download'];

/* ─── Default data ─── */
const defaultData = {
  personal: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '', summary: '' },
  education: [{ institution: '', degree: '', field: '', year: '', gpa: '' }],
  skills: { technical: '', soft: '', tools: '' },
  projects: [{ name: '', description: '', tech: '', link: '' }],
  experience: [{ company: '', role: '', duration: '', description: '' }],
  certifications: [{ name: '', issuer: '', year: '' }],
};

/* ─── Live Resume Preview ─── */
function ResumePreview({ data, template }) {
  if (template === 'sidebar') {
    return (
      <div className="w-full bg-white text-slate-900 rounded-lg overflow-hidden shadow-2xl text-[10px] font-sans">
        <div className="flex min-h-[500px]">
          {/* Left panel */}
          <div className="w-1/3 bg-blue-700 text-white p-4 flex flex-col gap-4">
            <div>
              <div className="w-14 h-14 rounded-full bg-blue-500 mx-auto mb-2 flex items-center justify-center text-xl font-bold">
                {data.personal.name ? data.personal.name[0] : 'U'}
              </div>
              <h1 className="text-sm font-bold text-center leading-tight">{data.personal.name || 'Your Name'}</h1>
              <p className="text-[9px] text-blue-200 text-center mt-0.5">{data.personal.summary?.slice(0, 60) || 'Software Engineer'}</p>
            </div>
            <div>
              <h3 className="text-[9px] font-bold uppercase tracking-wider text-blue-300 mb-1">Contact</h3>
              {data.personal.email && <p className="text-[8px] text-blue-100 mb-0.5">✉ {data.personal.email}</p>}
              {data.personal.phone && <p className="text-[8px] text-blue-100 mb-0.5">📞 {data.personal.phone}</p>}
              {data.personal.location && <p className="text-[8px] text-blue-100 mb-0.5">📍 {data.personal.location}</p>}
              {data.personal.linkedin && <p className="text-[8px] text-blue-100 mb-0.5">🔗 LinkedIn</p>}
            </div>
            <div>
              <h3 className="text-[9px] font-bold uppercase tracking-wider text-blue-300 mb-1">Skills</h3>
              <p className="text-[8px] text-blue-100 leading-relaxed">{data.skills.technical || 'React, Node.js, Python'}</p>
            </div>
          </div>
          {/* Right content */}
          <div className="flex-1 p-4">
            {data.education[0]?.institution && (
              <div className="mb-3">
                <h3 className="text-[9px] font-bold uppercase text-blue-700 border-b border-blue-200 pb-0.5 mb-1">Education</h3>
                {data.education.map((e, i) => (
                  <div key={i} className="mb-1">
                    <p className="font-semibold text-[9px]">{e.institution}</p>
                    <p className="text-[8px] text-slate-500">{e.degree} {e.field && `- ${e.field}`} {e.year && `(${e.year})`}</p>
                  </div>
                ))}
              </div>
            )}
            {data.experience[0]?.company && (
              <div className="mb-3">
                <h3 className="text-[9px] font-bold uppercase text-blue-700 border-b border-blue-200 pb-0.5 mb-1">Experience</h3>
                {data.experience.map((e, i) => (
                  <div key={i} className="mb-1">
                    <p className="font-semibold text-[9px]">{e.role} — {e.company}</p>
                    <p className="text-[8px] text-slate-500">{e.duration}</p>
                    <p className="text-[8px] text-slate-600 mt-0.5">{e.description?.slice(0, 80)}</p>
                  </div>
                ))}
              </div>
            )}
            {data.projects[0]?.name && (
              <div className="mb-3">
                <h3 className="text-[9px] font-bold uppercase text-blue-700 border-b border-blue-200 pb-0.5 mb-1">Projects</h3>
                {data.projects.map((p, i) => (
                  <div key={i} className="mb-1">
                    <p className="font-semibold text-[9px]">{p.name}</p>
                    <p className="text-[8px] text-slate-500">{p.tech}</p>
                    <p className="text-[8px] text-slate-600">{p.description?.slice(0, 80)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (template === 'creative') {
    return (
      <div className="w-full bg-white text-slate-900 rounded-lg overflow-hidden shadow-2xl text-[10px] font-sans">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-5">
          <h1 className="text-lg font-bold">{data.personal.name || 'Your Name'}</h1>
          <p className="text-purple-200 text-[9px] mt-0.5">{data.personal.summary?.slice(0, 80) || 'Full-Stack Developer'}</p>
          <div className="flex gap-4 mt-2 text-[8px] text-purple-200">
            {data.personal.email && <span>✉ {data.personal.email}</span>}
            {data.personal.phone && <span>📞 {data.personal.phone}</span>}
            {data.personal.location && <span>📍 {data.personal.location}</span>}
          </div>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          <div>
            {data.skills.technical && (
              <div className="mb-4">
                <h3 className="text-[9px] font-bold text-purple-600 uppercase mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-1">
                  {data.skills.technical.split(',').map((s, i) => (
                    <span key={i} className="text-[7px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full">{s.trim()}</span>
                  ))}
                </div>
              </div>
            )}
            {data.education[0]?.institution && (
              <div>
                <h3 className="text-[9px] font-bold text-purple-600 uppercase mb-1">Education</h3>
                {data.education.map((e, i) => (
                  <div key={i} className="mb-1">
                    <p className="font-semibold text-[9px]">{e.institution}</p>
                    <p className="text-[8px] text-slate-500">{e.degree} {e.year && `• ${e.year}`}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {data.experience[0]?.company && (
              <div className="mb-3">
                <h3 className="text-[9px] font-bold text-purple-600 uppercase mb-1">Experience</h3>
                {data.experience.map((e, i) => (
                  <div key={i} className="mb-1 pl-2 border-l-2 border-purple-300">
                    <p className="font-semibold text-[9px]">{e.role}</p>
                    <p className="text-[8px] text-slate-500">{e.company} · {e.duration}</p>
                  </div>
                ))}
              </div>
            )}
            {data.projects[0]?.name && (
              <div>
                <h3 className="text-[9px] font-bold text-purple-600 uppercase mb-1">Projects</h3>
                {data.projects.map((p, i) => (
                  <div key={i} className="mb-1 pl-2 border-l-2 border-pink-300">
                    <p className="font-semibold text-[9px]">{p.name}</p>
                    <p className="text-[8px] text-slate-500">{p.tech}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* Minimal / Professional (similar layout, different accents) */
  const isProf = template === 'professional';
  const headerBg = isProf ? 'bg-teal-700 text-white' : 'bg-slate-800 text-white';

  return (
    <div className="w-full bg-white text-slate-900 rounded-lg overflow-hidden shadow-2xl text-[10px] font-sans">
      <div className={`${headerBg} px-6 py-4`}>
        <h1 className="text-base font-bold">{data.personal.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-3 mt-1 text-[8px] opacity-80">
          {data.personal.email && <span>✉ {data.personal.email}</span>}
          {data.personal.phone && <span>📞 {data.personal.phone}</span>}
          {data.personal.location && <span>📍 {data.personal.location}</span>}
          {data.personal.linkedin && <span>🔗 LinkedIn</span>}
          {data.personal.github && <span>⭐ GitHub</span>}
        </div>
      </div>
      <div className="px-6 py-4 space-y-3">
        {data.personal.summary && (
          <div>
            <h3 className={`text-[9px] font-bold uppercase tracking-wide ${isProf ? 'text-teal-700' : 'text-slate-700'} border-b pb-0.5 mb-1.5`}>
              Summary
            </h3>
            <p className="text-[8px] text-slate-600 leading-relaxed">{data.personal.summary}</p>
          </div>
        )}
        {data.education[0]?.institution && (
          <div>
            <h3 className={`text-[9px] font-bold uppercase tracking-wide ${isProf ? 'text-teal-700' : 'text-slate-700'} border-b pb-0.5 mb-1.5`}>
              Education
            </h3>
            {data.education.map((e, i) => (
              <div key={i} className="flex justify-between mb-1">
                <div>
                  <p className="font-semibold text-[9px]">{e.institution}</p>
                  <p className="text-[8px] text-slate-500">{e.degree} {e.field && `in ${e.field}`}</p>
                </div>
                <p className="text-[8px] text-slate-500">{e.year} {e.gpa && `| GPA: ${e.gpa}`}</p>
              </div>
            ))}
          </div>
        )}
        {data.skills.technical && (
          <div>
            <h3 className={`text-[9px] font-bold uppercase tracking-wide ${isProf ? 'text-teal-700' : 'text-slate-700'} border-b pb-0.5 mb-1.5`}>
              Skills
            </h3>
            <p className="text-[8px] text-slate-600"><strong>Technical:</strong> {data.skills.technical}</p>
            {data.skills.tools && <p className="text-[8px] text-slate-600 mt-0.5"><strong>Tools:</strong> {data.skills.tools}</p>}
          </div>
        )}
        {data.experience[0]?.company && (
          <div>
            <h3 className={`text-[9px] font-bold uppercase tracking-wide ${isProf ? 'text-teal-700' : 'text-slate-700'} border-b pb-0.5 mb-1.5`}>
              Experience
            </h3>
            {data.experience.map((e, i) => (
              <div key={i} className="mb-1.5">
                <div className="flex justify-between">
                  <p className="font-semibold text-[9px]">{e.role} — {e.company}</p>
                  <p className="text-[8px] text-slate-500">{e.duration}</p>
                </div>
                <p className="text-[8px] text-slate-600 mt-0.5">{e.description?.slice(0, 100)}</p>
              </div>
            ))}
          </div>
        )}
        {data.projects[0]?.name && (
          <div>
            <h3 className={`text-[9px] font-bold uppercase tracking-wide ${isProf ? 'text-teal-700' : 'text-slate-700'} border-b pb-0.5 mb-1.5`}>
              Projects
            </h3>
            {data.projects.map((p, i) => (
              <div key={i} className="mb-1">
                <p className="font-semibold text-[9px]">{p.name} {p.tech && <span className="font-normal text-slate-500">— {p.tech}</span>}</p>
                <p className="text-[8px] text-slate-600">{p.description?.slice(0, 80)}</p>
              </div>
            ))}
          </div>
        )}
        {data.certifications[0]?.name && (
          <div>
            <h3 className={`text-[9px] font-bold uppercase tracking-wide ${isProf ? 'text-teal-700' : 'text-slate-700'} border-b pb-0.5 mb-1.5`}>
              Certifications
            </h3>
            {data.certifications.map((c, i) => (
              <p key={i} className="text-[8px] text-slate-600 mb-0.5">• {c.name} {c.issuer && `— ${c.issuer}`} {c.year && `(${c.year})`}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Step indicators ─── */
function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {STEPS.map((step, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < currentStep
                  ? 'bg-green-500 text-white'
                  : i === currentStep
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {i < currentStep ? <FiCheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={`text-xs hidden sm:block ${
                i === currentStep ? 'text-blue-300 font-medium' : i < currentStep ? 'text-green-400' : 'text-slate-500'
              }`}
            >
              {step}
            </span>
          </div>
          {i < totalSteps - 1 && (
            <div className={`flex-1 h-0.5 min-w-[8px] max-w-[20px] ${i < currentStep ? 'bg-green-500' : 'bg-slate-700'} transition-all`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function ManualBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [data, setData] = useState(defaultData);
  const [showPreview, setShowPreview] = useState(false);

  const updatePersonal = (field, value) =>
    setData((d) => ({ ...d, personal: { ...d.personal, [field]: value } }));

  const addItem = (section) => {
    const empty = {
      education: { institution: '', degree: '', field: '', year: '', gpa: '' },
      projects: { name: '', description: '', tech: '', link: '' },
      experience: { company: '', role: '', duration: '', description: '' },
      certifications: { name: '', issuer: '', year: '' },
    }[section];
    setData((d) => ({ ...d, [section]: [...d[section], empty] }));
  };

  const removeItem = (section, index) =>
    setData((d) => ({ ...d, [section]: d[section].filter((_, i) => i !== index) }));

  const updateItem = (section, index, field, value) =>
    setData((d) => ({
      ...d,
      [section]: d[section].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));

  const inputCls =
    'w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all focus:border-blue-500';

  const labelCls = 'block text-xs font-medium text-slate-400 mb-1';

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ x: -3 }}
              onClick={() => navigate('/resume-builder')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-base font-bold text-white">Manual Resume Builder</h1>
              <p className="text-xs text-slate-500">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
            >
              <FiEye className="w-4 h-4" />
              {showPreview ? 'Hide' : 'Preview'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => downloadAsPDF(data, selectedTemplate)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm text-white transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Download PDF
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Step indicators */}
        <div className="mb-8 overflow-x-auto pb-2">
          <StepIndicator currentStep={step} totalSteps={STEPS.length} />
        </div>

        <div className={`grid gap-8 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
          {/* Left: Form */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
              >
                {/* ── STEP 0: Template ── */}
                {step === 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-2">Choose Your Template</h2>
                    <p className="text-slate-400 text-sm mb-6">Select a template to get started. You can switch anytime.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {templates.map((t) => (
                        <TemplatePreviewCard
                          key={t.id}
                          id={t.id}
                          name={t.name}
                          selected={selectedTemplate === t.id}
                          onSelect={() => setSelectedTemplate(t.id)}
                          description={t.description}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* ── STEP 1: Personal Info ── */}
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <FiUser className="w-5 h-5 text-blue-400" /> Personal Information
                    </h2>
                    <p className="text-slate-400 text-sm mb-6">Your contact details and a brief professional summary.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Full Name', field: 'name', placeholder: 'John Doe', icon: FiUser },
                        { label: 'Email Address', field: 'email', placeholder: 'john@example.com', icon: FiMail },
                        { label: 'Phone Number', field: 'phone', placeholder: '+91 9876543210', icon: FiPhone },
                        { label: 'Location', field: 'location', placeholder: 'Bengaluru, India', icon: FiMapPin },
                        { label: 'LinkedIn URL', field: 'linkedin', placeholder: 'linkedin.com/in/yourname', icon: FiLinkedin },
                        { label: 'GitHub URL', field: 'github', placeholder: 'github.com/yourname', icon: FiGithub },
                        { label: 'Portfolio / Website', field: 'website', placeholder: 'yoursite.com', icon: FiGlobe },
                      ].map(({ label, field, placeholder, icon: Icon }) => (
                        <div key={field} className={field === 'website' ? 'sm:col-span-2' : ''}>
                          <label className={labelCls}>{label}</label>
                          <div className="relative">
                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                              type="text"
                              placeholder={placeholder}
                              value={data.personal[field]}
                              onChange={(e) => updatePersonal(field, e.target.value)}
                              className={inputCls + ' pl-9'}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Professional Summary</label>
                        <textarea
                          placeholder="Write a brief summary about yourself, your role, and your key strengths..."
                          value={data.personal.summary}
                          onChange={(e) => updatePersonal('summary', e.target.value)}
                          rows={4}
                          className={inputCls + ' resize-none'}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Education ── */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <FiBook className="w-5 h-5 text-purple-400" /> Education
                    </h2>
                    <p className="text-slate-400 text-sm mb-6">Add your academic qualifications.</p>
                    <div className="space-y-4">
                      {data.education.map((edu, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 relative"
                        >
                          <p className="text-xs font-semibold text-slate-400 mb-3">Education #{i + 1}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              { label: 'Institution', field: 'institution', placeholder: 'RGUKT / VIT / IIT' },
                              { label: 'Degree', field: 'degree', placeholder: 'B.Tech / B.E.' },
                              { label: 'Field of Study', field: 'field', placeholder: 'Computer Science' },
                              { label: 'Graduation Year', field: 'year', placeholder: '2025' },
                              { label: 'GPA / Percentage', field: 'gpa', placeholder: '8.5 / 85%' },
                            ].map(({ label, field, placeholder }) => (
                              <div key={field}>
                                <label className={labelCls}>{label}</label>
                                <input
                                  type="text"
                                  placeholder={placeholder}
                                  value={edu[field]}
                                  onChange={(e) => updateItem('education', i, field, e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                            ))}
                          </div>
                          {data.education.length > 1 && (
                            <button
                              onClick={() => removeItem('education', i)}
                              className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                      <button
                        onClick={() => addItem('education')}
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <FiPlus className="w-4 h-4" /> Add Another Education
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Skills ── */}
                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <FiCode className="w-5 h-5 text-cyan-400" /> Skills
                    </h2>
                    <p className="text-slate-400 text-sm mb-6">List your technical and soft skills separated by commas.</p>
                    <div className="space-y-4">
                      {[
                        { label: 'Technical Skills', field: 'technical', placeholder: 'React, Node.js, Python, Java, SQL, MongoDB' },
                        { label: 'Soft Skills', field: 'soft', placeholder: 'Leadership, Communication, Problem Solving' },
                        { label: 'Tools & Frameworks', field: 'tools', placeholder: 'Git, Docker, VS Code, Figma, AWS' },
                      ].map(({ label, field, placeholder }) => (
                        <div key={field}>
                          <label className={labelCls}>{label}</label>
                          <textarea
                            placeholder={placeholder}
                            value={data.skills[field]}
                            onChange={(e) =>
                              setData((d) => ({ ...d, skills: { ...d.skills, [field]: e.target.value } }))
                            }
                            rows={3}
                            className={inputCls + ' resize-none'}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Projects ── */}
                {step === 4 && (
                  <div>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <FiGlobe className="w-5 h-5 text-green-400" /> Projects
                    </h2>
                    <p className="text-slate-400 text-sm mb-6">Showcase your best work — focus on impact and technologies used.</p>
                    <div className="space-y-4">
                      {data.projects.map((proj, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 relative"
                        >
                          <p className="text-xs font-semibold text-slate-400 mb-3">Project #{i + 1}</p>
                          <div className="space-y-3">
                            {[
                              { label: 'Project Name', field: 'name', placeholder: 'AI Resume Builder' },
                              { label: 'Tech Stack', field: 'tech', placeholder: 'React, Node.js, OpenAI API' },
                              { label: 'Live Link / GitHub', field: 'link', placeholder: 'https://github.com/...' },
                            ].map(({ label, field, placeholder }) => (
                              <div key={field}>
                                <label className={labelCls}>{label}</label>
                                <input
                                  type="text"
                                  placeholder={placeholder}
                                  value={proj[field]}
                                  onChange={(e) => updateItem('projects', i, field, e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                            ))}
                            <div>
                              <label className={labelCls}>Description (use bullet points)</label>
                              <textarea
                                placeholder="• Built a full-stack resume builder with AI optimization&#10;• Increased ATS score by 40% using keyword matching"
                                value={proj.description}
                                onChange={(e) => updateItem('projects', i, 'description', e.target.value)}
                                rows={4}
                                className={inputCls + ' resize-none'}
                              />
                            </div>
                          </div>
                          {data.projects.length > 1 && (
                            <button
                              onClick={() => removeItem('projects', i)}
                              className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                      <button
                        onClick={() => addItem('projects')}
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <FiPlus className="w-4 h-4" /> Add Another Project
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 5: Experience ── */}
                {step === 5 && (
                  <div>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <FiBriefcase className="w-5 h-5 text-orange-400" /> Experience
                    </h2>
                    <p className="text-slate-400 text-sm mb-6">Add internships, part-time jobs, and full-time roles.</p>
                    <div className="space-y-4">
                      {data.experience.map((exp, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 relative"
                        >
                          <p className="text-xs font-semibold text-slate-400 mb-3">Experience #{i + 1}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              { label: 'Company / Organization', field: 'company', placeholder: 'Google, TCS, Startup' },
                              { label: 'Job Title / Role', field: 'role', placeholder: 'Software Engineer Intern' },
                              { label: 'Duration', field: 'duration', placeholder: 'Jun 2024 – Aug 2024' },
                            ].map(({ label, field, placeholder }) => (
                              <div key={field}>
                                <label className={labelCls}>{label}</label>
                                <input
                                  type="text"
                                  placeholder={placeholder}
                                  value={exp[field]}
                                  onChange={(e) => updateItem('experience', i, field, e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                            ))}
                            <div className="sm:col-span-2">
                              <label className={labelCls}>Responsibilities & Achievements</label>
                              <textarea
                                placeholder="• Developed REST APIs serving 10k+ daily users&#10;• Reduced page load time by 30% using lazy loading"
                                value={exp.description}
                                onChange={(e) => updateItem('experience', i, 'description', e.target.value)}
                                rows={4}
                                className={inputCls + ' resize-none'}
                              />
                            </div>
                          </div>
                          {data.experience.length > 1 && (
                            <button
                              onClick={() => removeItem('experience', i)}
                              className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                      <button
                        onClick={() => addItem('experience')}
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <FiPlus className="w-4 h-4" /> Add Another Experience
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 6: Certifications ── */}
                {step === 6 && (
                  <div>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <FiAward className="w-5 h-5 text-yellow-400" /> Certifications
                    </h2>
                    <p className="text-slate-400 text-sm mb-6">Add courses, certifications, and achievements.</p>
                    <div className="space-y-4">
                      {data.certifications.map((cert, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 relative"
                        >
                          <p className="text-xs font-semibold text-slate-400 mb-3">Certification #{i + 1}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { label: 'Certification Name', field: 'name', placeholder: 'AWS Cloud Practitioner' },
                              { label: 'Issuing Organization', field: 'issuer', placeholder: 'Amazon Web Services' },
                              { label: 'Year', field: 'year', placeholder: '2024' },
                            ].map(({ label, field, placeholder }) => (
                              <div key={field}>
                                <label className={labelCls}>{label}</label>
                                <input
                                  type="text"
                                  placeholder={placeholder}
                                  value={cert[field]}
                                  onChange={(e) => updateItem('certifications', i, field, e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                            ))}
                          </div>
                          {data.certifications.length > 1 && (
                            <button
                              onClick={() => removeItem('certifications', i)}
                              className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                      <button
                        onClick={() => addItem('certifications')}
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <FiPlus className="w-4 h-4" /> Add Another Certification
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 7: Preview & Download ── */}
                {step === 7 && (
                  <div>
                    <h2 className="text-xl font-bold mb-2">Your Resume is Ready! 🎉</h2>
                    <p className="text-slate-400 text-sm mb-6">Review your resume and download in your preferred format.</p>
                    <div className="mb-6">
                      <p className="text-sm text-slate-400 mb-3">Switch Template:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                    </div>
                    <div className="overflow-auto rounded-xl border border-slate-700 p-4 bg-slate-800/30 mb-6">
                      <ResumePreview data={data} template={selectedTemplate} />
                    </div>
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => downloadAsPDF(data, selectedTemplate)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
                      >
                        <FiDownload className="w-4 h-4" /> Download PDF
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => downloadAsDoc(data, selectedTemplate)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm transition-colors"
                      >
                        <FiDownload className="w-4 h-4" /> Download DOCX
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-4 border-t border-slate-800">
                  <motion.button
                    whileHover={{ x: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={prevStep}
                    disabled={step === 0}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      step === 0
                        ? 'opacity-30 cursor-not-allowed text-slate-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    <FiArrowLeft className="w-4 h-4" /> Previous
                  </motion.button>
                  {step < STEPS.length - 1 && (
                    <motion.button
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={nextStep}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
                    >
                      Next <FiArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Live Preview */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="lg:sticky lg:top-24 h-fit"
            >
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-300">Live Preview</p>
                  <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full animate-pulse">
                    Auto-updating
                  </span>
                </div>
                <div className="overflow-auto max-h-[75vh] rounded-xl">
                  <ResumePreview data={data} template={selectedTemplate} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
