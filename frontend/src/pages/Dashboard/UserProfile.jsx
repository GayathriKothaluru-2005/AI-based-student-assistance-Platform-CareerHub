import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiSave, FiEdit2, FiBook, FiMapPin, FiPhone, FiAward, FiCode } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Passed Out'];
const SKILLS_POOL = ['Python', 'Java', 'C++', 'JavaScript', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Analysis', 'Cloud (AWS/GCP)', 'Docker', 'Git'];

export default function UserProfile() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    college: '',
    branch: '',
    year: '',
    cgpa: '',
    city: '',
    linkedinUrl: '',
    githubUrl: '',
    careerGoal: '',
    selectedSkills: [],
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter((s) => s !== skill)
        : [...prev.selectedSkills, skill],
    }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just show saved state (backend integration coming)
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass =
    'w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors';

  const labelClass = 'block text-slate-600 dark:text-slate-400 text-xs font-medium mb-1.5';

  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center shadow-lg">
            <FiUser size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
            <p className="text-slate-500 text-sm">Keep your details updated to personalize your experience</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-5 flex items-center gap-2">
            <FiUser size={16} className="text-blue-400" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`${inputClass} opacity-70 cursor-not-allowed`}
                readOnly
              />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <div className="relative">
                <FiPhone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>City / Location</label>
              <div className="relative">
                <FiMapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Chennai, Tamil Nadu"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Academic Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-5 flex items-center gap-2">
            <FiBook size={16} className="text-purple-400" />
            Academic Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>College / University Name</label>
              <input
                name="college"
                value={form.college}
                onChange={handleChange}
                placeholder="e.g. Anna University, IIT Madras"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Branch / Department</label>
              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className={`${inputClass} appearance-none`}
              >
                <option value="">Select Branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Current Year</label>
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className={`${inputClass} appearance-none`}
              >
                <option value="">Select Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>CGPA / Percentage</label>
              <div className="relative">
                <FiAward size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="cgpa"
                  value={form.cgpa}
                  onChange={handleChange}
                  placeholder="8.5 / 85%"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-5 flex items-center gap-2">
            <FiCode size={16} className="text-green-400" />
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS_POOL.map((skill) => {
              const selected = form.selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selected
                  ? 'bg-blue-500/15 border-blue-500/40 text-blue-500 dark:text-blue-400'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {selected ? '✓ ' : ''}{skill}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Online Profiles + Career Goal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-5 flex items-center gap-2">
            <FiEdit2 size={16} className="text-cyan-400" />
            Online Profiles & Goal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>LinkedIn URL</label>
              <input
                name="linkedinUrl"
                value={form.linkedinUrl}
                onChange={handleChange}
                placeholder="linkedin.com/in/yourname"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>GitHub URL</label>
              <input
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="github.com/yourname"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Career Goal</label>
              <textarea
                name="careerGoal"
                value={form.careerGoal}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. I want to become a full-stack developer at a product-based company within 1 year..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between gap-4"
        >
          {saved && (
            <span className="text-green-400 text-sm font-medium flex items-center gap-1.5">
              ✓ Profile saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
          >
            <FiSave size={15} />
            Save Profile
          </button>
        </motion.div>
      </form>
    </div>
  );
}
