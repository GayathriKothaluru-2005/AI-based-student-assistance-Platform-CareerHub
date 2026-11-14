import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiTrash2, FiLoader, FiCalendar, FiClock,
  FiBarChart2, FiCheckCircle, FiAlertCircle, FiZap, FiDownload
} from 'react-icons/fi';
import api from '../../utils/api';
import { downloadAsPDF, generateTimetablePDF } from '../../utils/downloadUtils';

const DIFFICULTY_LEVELS = [
  { value: 1, label: '⭐ Very Easy' },
  { value: 3, label: '⭐⭐ Easy' },
  { value: 5, label: '⭐⭐⭐ Medium' },
  { value: 7, label: '⭐⭐⭐⭐ Hard' },
  { value: 9, label: '⭐⭐⭐⭐⭐ Very Hard' },
];

export default function TimetableGenerator() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    name: '',
    difficulty: 5,
    examDate: '',
    dailyHours: 2,
  });
  const [studyWindow, setStudyWindow] = useState({
    start: '09:00',
    end: '17:00',
  });
  const [dailyHours, setDailyHours] = useState(6);
  const [loading, setLoading] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('input'); // input, timetable, suggestions

  // Add subject to list
  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.examDate) {
      setError('Please fill in subject name and exam date.');
      return;
    }
    setSubjects([...subjects, { ...newSubject, id: Date.now() }]);
    setNewSubject({ name: '', difficulty: 5, examDate: '', dailyHours: 2 });
    setError('');
  };

  // Remove subject
  const handleRemoveSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  // Generate timetable
  const handleGenerateTimetable = async () => {
    if (subjects.length === 0) {
      setError('Please add at least one subject.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedTimetable(null);

    try {
      const { data } = await api.post('/timetable/generate', {
        subjects: subjects.map(({ id, ...s }) => s),
        studyWindowStart: studyWindow.start,
        studyWindowEnd: studyWindow.end,
        dailyHours,
      });

      setGeneratedTimetable(data);
      setActiveTab('timetable');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate timetable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Download timetable as PDF
  const handleDownloadPDF = async () => {
    if (!generatedTimetable) return;
    const html = generateTimetablePDF(generatedTimetable, subjects);
    await downloadAsPDF(html, 'Study_Timetable_Report.pdf');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl p-6"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
            <FiCalendar size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Smart Timetable Generator</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">AI-powered study planner optimized for your exams</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'input', label: '📝 Setup', icon: '⚙️' },
          { id: 'timetable', label: '📅 Timetable', icon: '📊', disabled: !generatedTimetable },
          { id: 'suggestions', label: '💡 AI Tips', icon: '✨', disabled: !generatedTimetable },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={`px-4 py-3 font-medium text-sm transition-all ${
              activeTab === tab.id
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 opacity-50 cursor-not-allowed'
            } ${!tab.disabled && 'cursor-pointer hover:text-slate-900 dark:hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Tabs */}
      <AnimatePresence mode="wait">
        {/* INPUT TAB */}
        {activeTab === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2">
                <FiAlertCircle size={18} className="text-red-500" />
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Add Subject Form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Add a Subject</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Subject name (e.g., Mathematics)"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={newSubject.examDate}
                  onChange={(e) => setNewSubject({ ...newSubject, examDate: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={newSubject.difficulty}
                  onChange={(e) => setNewSubject({ ...newSubject, difficulty: Number(e.target.value) })}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {DIFFICULTY_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0.5"
                    max="12"
                    step="0.5"
                    value={newSubject.dailyHours}
                    onChange={(e) => setNewSubject({ ...newSubject, dailyHours: Number(e.target.value) })}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Daily hours"
                  />
                  <span className="text-slate-500 dark:text-slate-400 text-sm">hrs/day</span>
                </div>
              </div>
              <button
                onClick={handleAddSubject}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FiPlus size={16} /> Add Subject
              </button>
            </div>

            {/* Subjects List */}
            {subjects.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white">Your Subjects ({subjects.length})</h3>
                {subjects.map(subject => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">{subject.name}</p>
                      <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-400 mt-1">
                        <span>{DIFFICULTY_LEVELS.find(d => d.value === subject.difficulty)?.label}</span>
                        <span>📅 {new Date(subject.examDate).toLocaleDateString()}</span>
                        <span>⏱️ {subject.dailyHours} hrs/day</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveSubject(subject.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Study Window & Daily Hours */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Study Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Study Start Time</label>
                  <input
                    type="time"
                    value={studyWindow.start}
                    onChange={(e) => setStudyWindow({ ...studyWindow, start: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Study End Time</label>
                  <input
                    type="time"
                    value={studyWindow.end}
                    onChange={(e) => setStudyWindow({ ...studyWindow, end: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Daily Study Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateTimetable}
              disabled={loading || subjects.length === 0}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={16} /> Generating Timetable...
                </>
              ) : (
                <>
                  <FiZap size={16} /> Generate Optimized Timetable
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* TIMETABLE TAB */}
        {activeTab === 'timetable' && generatedTimetable && (
          <motion.div
            key="timetable"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Header with Download Button */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">📅 Your Study Timetable</h2>
                  <p className="text-indigo-100">Optimized weekly schedule with smart breaks and revision sessions</p>
                </div>
                
                {/* Download Button - Prominent */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadPDF}
                  className="flex flex-col items-center gap-2 px-8 py-5 bg-white text-indigo-600 font-bold rounded-xl transition-all hover:shadow-2xl active:scale-95 flex-shrink-0 hover:bg-indigo-50"
                >
                  <FiDownload size={24} />
                  <span className="text-sm">Download PDF</span>
                </motion.button>
              </div>
            </div>

            {/* Subject Analysis */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-sm font-bold">📊</span>
                Subject Priority Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generatedTimetable.subjectsAnalysis?.map((subject, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">{subject.name}</h4>
                    <span className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-xs font-bold">Priority</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-xl">📊</span>
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">Difficulty Level</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{subject.difficulty}/10</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-xl">📅</span>
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">Exam Date</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{new Date(subject.examDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-xl">⏳</span>
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">Days Remaining</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{subject.daysUntilExam} days</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Priority Score</p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{subject.priority}</p>
                  </div>
                </motion.div>
              ))}
              </div>
            </div>

            {/* Weekly Timetable */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-sm font-bold">📋</span>
                Weekly Schedule
              </h3>
              <div className="space-y-4">
                {Object.entries(generatedTimetable.timetable).map(([day, sessions], dayIdx) => (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: dayIdx * 0.05 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4">
                      <h3 className="font-bold text-white text-lg">{day}</h3>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                      {sessions.map((session, idx) => (
                        <div
                          key={idx}
                          className={`px-6 py-4 flex items-center justify-between ${
                            session.type === 'break'
                              ? 'bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500'
                              : session.type === 'revision'
                              ? 'bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-emerald-500'
                              : 'bg-white dark:bg-slate-900 border-l-4 border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          } transition-colors`}
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 dark:text-white text-base">{session.subject}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                                🕐 {session.startTime}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                                ⏱️ {session.interval}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {session.type === 'revision' && (
                              <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                                🔄 Revision
                              </span>
                            )}
                            {session.type === 'break' && (
                              <span className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5">
                                ☕ Break
                              </span>
                            )}
                            {session.type === 'study' && (
                              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 ${
                                session.difficulty > 6 ? 'bg-red-500 dark:bg-red-600' :
                                session.difficulty > 4 ? 'bg-orange-500 dark:bg-orange-600' : 'bg-green-500 dark:bg-green-600'
                              }`}>
                                📚 Difficulty: {session.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            </div>
          </motion.div>
        )}

        {/* SUGGESTIONS TAB */}
        {activeTab === 'suggestions' && generatedTimetable && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <FiZap size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">AI-Powered Study Suggestions</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                {generatedTimetable.studySuggestions}
              </p>
            </div>

            {/* Dashboard Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiClock size={18} className="text-blue-500" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Study Hours/Week</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{dailyHours * 7}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiBarChart2 size={18} className="text-indigo-500" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Subjects Covered</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{subjects.length}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiCheckCircle size={18} className="text-green-500" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Study Days/Week</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">7</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
