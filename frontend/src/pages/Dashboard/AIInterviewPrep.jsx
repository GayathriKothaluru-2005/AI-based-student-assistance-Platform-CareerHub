import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FiUpload,
  FiPlay,
  FiChevronDown,
  FiChevronUp,
  FiTrash2,
  FiRefreshCw,
  FiCheck,
} from 'react-icons/fi';
import axios from 'axios';

const AIInterviewPrep = ({ isEmbedded = false, onBack = null }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState('hrQuestions');
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedPreps, setSavedPreps] = useState([]);
  const [showSavedList, setShowSavedList] = useState(false);

  // API instance
  const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  });

  // Add auth token to requests
  API.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Load saved interview preps on mount
  const loadSavedPreps = useCallback(async () => {
    try {
      const response = await API.get('/interview-prep/list');
      setSavedPreps(response.data.interviewPreps || []);
    } catch (err) {
      console.error('Error loading saved preps:', err);
    }
  }, []);

  useEffect(() => {
    loadSavedPreps();
  }, [loadSavedPreps]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadResume(file);
    }
  };

  const uploadResume = async (file) => {
    setLoading(true);
    setError(null);

    // Validate file
    if (!file) {
      setError('Please select a file');
      setLoading(false);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      setLoading(false);
      return;
    }

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(file.type)) {
      setError('Only PDF and DOCX files are supported');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await API.post('/interview-prep/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setInterviewData(response.data.interviewPrep);
      setPracticeMode(false);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setFeedback(null);
      loadSavedPreps();
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Cannot connect to server. Please ensure the backend is running on port 5000.');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (err.response?.status === 500) {
        setError('Server error while processing resume. Please try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to process resume. Please try again.');
      }
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadInterviewPrep = async (prepId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await API.get(`/interview-prep/${prepId}`);
      setInterviewData(response.data);
      setPracticeMode(false);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setFeedback(null);
      setShowSavedList(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load interview prep');
    } finally {
      setLoading(false);
    }
  };

  const deleteInterviewPrep = async (prepId) => {
    if (window.confirm('Are you sure you want to delete this interview prep?')) {
      try {
        await API.delete(`/interview-prep/${prepId}`);
        loadSavedPreps();
        if (interviewData?.id === prepId) {
          setInterviewData(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const startPractice = () => {
    if (interviewData?.interviewQuestions) {
      setPracticeMode(true);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setFeedback(null);
    }
  };

  const submitAnswer = async () => {
    setFeedbackLoading(true);
    setError(null);

    try {
      const allQuestions = [
        ...interviewData.interviewQuestions.hrQuestions,
        ...interviewData.interviewQuestions.technicalQuestions,
        ...interviewData.interviewQuestions.projectQuestions,
        ...interviewData.interviewQuestions.experienceQuestions,
        ...interviewData.interviewQuestions.resumeBasedQuestions,
      ];

      const currentQuestion = allQuestions[currentQuestionIndex];

      const response = await API.post(
        `/interview-prep/${interviewData.id}/submit-answer`,
        {
          question: currentQuestion,
          answer: userAnswer,
        }
      );

      setFeedback(response.data.feedback);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const nextQuestion = () => {
    const allQuestions = [
      ...interviewData.interviewQuestions.hrQuestions,
      ...interviewData.interviewQuestions.technicalQuestions,
      ...interviewData.interviewQuestions.projectQuestions,
      ...interviewData.interviewQuestions.experienceQuestions,
      ...interviewData.interviewQuestions.resumeBasedQuestions,
    ];

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setFeedback(null);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Render practice mode
  if (practiceMode && interviewData) {
    const allQuestions = [
      ...interviewData.interviewQuestions.hrQuestions,
      ...interviewData.interviewQuestions.technicalQuestions,
      ...interviewData.interviewQuestions.projectQuestions,
      ...interviewData.interviewQuestions.experienceQuestions,
      ...interviewData.interviewQuestions.resumeBasedQuestions,
    ];

    const currentQuestion = allQuestions[currentQuestionIndex];

    return (
      <div className={`${isEmbedded ? 'bg-white dark:bg-gray-900' : 'min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900'} p-6`}>
        <div className={`${isEmbedded ? 'w-full' : 'max-w-4xl mx-auto'}`}>
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setPracticeMode(false)}
              className="text-emerald-400 hover:text-emerald-300 mb-4 flex items-center gap-2 font-semibold"
            >
              ← Back to Questions
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2">Practice Mode</h1>
            <p className="text-gray-300">
              Question {currentQuestionIndex + 1} of {allQuestions.length}
            </p>
          </div>

          {/* Question Card */}
          <div className="bg-gradient-to-br from-purple-800/40 to-indigo-800/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 mb-6 shadow-2xl">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent mb-6">{currentQuestion}</h2>

            {/* Answer Input */}
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full bg-slate-800/60 border border-purple-400/30 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 mb-4 h-32 transition-all"
            />

            {/* Submit Button */}
            <button
              onClick={submitAnswer}
              disabled={!userAnswer.trim() || feedbackLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all mb-6 shadow-lg hover:shadow-emerald-500/50"
            >
              {feedbackLoading ? 'Getting Feedback...' : 'Get AI Feedback'}
            </button>

            {/* Feedback Section */}
            {feedback && (
              <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-400/40 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FiCheck className="text-emerald-400 text-xl" />
                  <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">AI Feedback</h3>
                </div>

                <div className="space-y-4">
                  {/* Score */}
                  <div>
                    <p className="text-gray-300 text-sm mb-2 font-semibold">Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-700/50 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-3 rounded-full transition-all shadow-lg shadow-emerald-400/50"
                          style={{ width: `${(feedback.score / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-emerald-300 font-bold text-lg">{feedback.score}/10</span>
                    </div>
                  </div>

                  {/* Strengths */}
                  {feedback.strengths && feedback.strengths.length > 0 && (
                    <div>
                      <p className="text-emerald-300 font-bold mb-2">✓ Strengths</p>
                      <ul className="space-y-1">
                        {feedback.strengths.map((strength, idx) => (
                          <li key={idx} className="text-gray-200 text-sm">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Areas for Improvement */}
                  {feedback.areasForImprovement && feedback.areasForImprovement.length > 0 && (
                    <div>
                      <p className="text-amber-300 font-bold mb-2">↑ Areas for Improvement</p>
                      <ul className="space-y-1">
                        {feedback.areasForImprovement.map((area, idx) => (
                          <li key={idx} className="text-gray-200 text-sm">
                            • {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improved Answer */}
                  {feedback.improvedAnswer && (
                    <div>
                      <p className="text-cyan-300 font-bold mb-2">💡 Suggested Answer</p>
                      <p className="text-gray-200 text-sm bg-slate-800/60 p-3 rounded-lg border border-cyan-400/20">
                        {feedback.improvedAnswer}
                      </p>
                    </div>
                  )}

                  {/* Tips */}
                  {feedback.tips && feedback.tips.length > 0 && (
                    <div>
                      <p className="text-blue-300 font-bold mb-2">💬 Tips</p>
                      <ul className="space-y-1">
                        {feedback.tips.map((tip, idx) => (
                          <li key={idx} className="text-gray-200 text-sm">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex >= allQuestions.length - 1 || !feedback}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Next Question</span>
                <FiChevronDown />
              </button>
              <button
                onClick={() => setPracticeMode(false)}
                className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold py-2 px-4 rounded-xl transition-all shadow-lg"
              >
                Exit Practice
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render main view
  return (
    <div className={`${isEmbedded ? 'bg-white dark:bg-gray-900' : 'min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900'} p-6`}>
      <div className={`${isEmbedded ? 'w-full' : 'max-w-5xl mx-auto'}`}>
        {/* Back Button for Embedded Mode */}
        {isEmbedded && onBack && (
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            ← Back to Career Tools
          </button>
        )}
        
        {/* Header */}
        <div className="mb-8">
          <h1 className={`${isEmbedded ? 'text-3xl text-slate-900 dark:text-white' : 'text-5xl bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent'} font-bold mb-2`}>
            AI Interview Preparation
          </h1>
          <p className={`${isEmbedded ? 'text-slate-600 dark:text-slate-400' : 'text-gray-300 text-lg'}`}>
            Upload your resume and get personalized interview questions + AI feedback
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/50 text-red-300 rounded-xl p-4 mb-6 shadow-lg">
            {error}
          </div>
        )}

        {/* Resume Upload Section */}
        {!interviewData && (
          <div className={`${isEmbedded ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50' : 'bg-gradient-to-br from-purple-800/40 to-indigo-800/40 border-purple-500/30'} backdrop-blur-xl border rounded-2xl p-8 mb-6 shadow-2xl`}>
            <h2 className={`text-2xl font-bold ${isEmbedded ? 'text-slate-900 dark:text-white' : 'bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent'} mb-4`}>Step 1: Upload Resume</h2>
            <p className={`${isEmbedded ? 'text-slate-600 dark:text-gray-400' : 'text-gray-300'} mb-6`}>
              Upload your resume (PDF or DOCX) to get started. We'll extract your information and generate
              personalized interview questions.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/50 text-lg"
            >
              <FiUpload className="text-2xl" />
              {loading ? 'Processing Resume...' : 'Upload Resume'}
            </button>

            <p className="text-gray-400 text-sm mt-4">
              Supported formats: PDF, DOC, DOCX (Max 5 MB)
            </p>
          </div>
        )}

        {/* Saved Preps List */}
        {!interviewData && savedPreps.length > 0 && (
          <div className="bg-gradient-to-br from-purple-800/40 to-indigo-800/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 mb-6 shadow-2xl">
            <button
              onClick={() => setShowSavedList(!showSavedList)}
              className="w-full flex items-center justify-between text-white font-bold hover:text-emerald-300 transition-all"
            >
              <span className="text-lg">📁 Your Saved Interviews ({savedPreps.length})</span>
              {showSavedList ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
            </button>

            {showSavedList && (
              <div className="mt-4 space-y-2">
                {savedPreps.map((prep) => (
                  <div
                    key={prep.id}
                    className="flex items-center justify-between bg-slate-800/60 p-4 rounded-xl border border-purple-400/20 hover:border-emerald-400/40 transition-all"
                  >
                    <div className="flex-1">
                      <p className="text-white font-semibold">{prep.fileName}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(prep.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadInterviewPrep(prep.id)}
                        className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all font-semibold"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteInterviewPrep(prep.id)}
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg transition-all"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Questions Display */}
        {interviewData && (
          <>
            {/* Resume Analysis */}
            <div className="bg-gradient-to-br from-purple-800/40 to-indigo-800/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 mb-6 shadow-2xl">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent mb-6">Resume Analysis</h2>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Name */}
                {interviewData.parsedResume?.name && (
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-purple-400/20 hover:border-cyan-400/40 transition-all">
                    <p className="text-gray-400 text-xs mb-1 font-semibold uppercase tracking-wide">Name</p>
                    <p className="text-white font-bold text-lg">{interviewData.parsedResume.name}</p>
                  </div>
                )}

                {/* Email */}
                {interviewData.parsedResume?.email && (
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-purple-400/20 hover:border-cyan-400/40 transition-all">
                    <p className="text-gray-400 text-xs mb-1 font-semibold uppercase tracking-wide">Email</p>
                    <a href={`mailto:${interviewData.parsedResume.email}`} className="text-cyan-300 hover:text-cyan-400 font-semibold break-all">
                      {interviewData.parsedResume.email}
                    </a>
                  </div>
                )}

                {/* Phone */}
                {interviewData.parsedResume?.phone && (
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-purple-400/20 hover:border-cyan-400/40 transition-all">
                    <p className="text-gray-400 text-xs mb-1 font-semibold uppercase tracking-wide">Phone</p>
                    <a href={`tel:${interviewData.parsedResume.phone}`} className="text-emerald-300 hover:text-emerald-400 font-semibold">
                      {interviewData.parsedResume.phone}
                    </a>
                  </div>
                )}

                {/* Experience Level */}
                {interviewData.resumeAnalysis?.experienceLevel && (
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-purple-400/20 hover:border-cyan-400/40 transition-all">
                    <p className="text-gray-400 text-xs mb-1 font-semibold uppercase tracking-wide">Experience Level</p>
                    <p className="text-emerald-300 font-bold text-lg capitalize">
                      {interviewData.resumeAnalysis.experienceLevel}
                    </p>
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              {interviewData.resumeAnalysis?.techStack && interviewData.resumeAnalysis.techStack.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-wide">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {interviewData.resumeAnalysis.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-cyan-500/30 to-emerald-500/30 border border-cyan-400/50 text-cyan-300 px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg hover:from-cyan-500/50 hover:to-emerald-500/50 transition-all"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {interviewData.parsedResume?.experience && interviewData.parsedResume.experience.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-wide">Work Experience</p>
                  <div className="space-y-2">
                    {interviewData.parsedResume.experience.map((exp, idx) => (
                      <div key={idx} className="bg-slate-800/40 p-4 rounded-xl border border-purple-400/20 hover:border-blue-400/40 transition-all">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-white font-bold">{exp.role}</h4>
                          <span className="text-blue-300 text-sm font-semibold">{exp.duration}</span>
                        </div>
                        <p className="text-gray-400 text-sm">{exp.company}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {interviewData.parsedResume?.education && interviewData.parsedResume.education.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-wide">Education</p>
                  <div className="space-y-2">
                    {interviewData.parsedResume.education.map((edu, idx) => (
                      <div key={idx} className="bg-slate-800/40 p-4 rounded-xl border border-purple-400/20 hover:border-amber-400/40 transition-all">
                        <p className="text-white font-bold">{edu.degree}</p>
                        {edu.field && <p className="text-gray-400 text-sm">{edu.field}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {interviewData.parsedResume?.projects && interviewData.parsedResume.projects.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-wide">Projects</p>
                  <div className="space-y-2">
                    {interviewData.parsedResume.projects.map((proj, idx) => (
                      <div key={idx} className="bg-slate-800/40 p-4 rounded-xl border border-purple-400/20 hover:border-green-400/40 transition-all">
                        <h4 className="text-white font-bold mb-1">{proj.title}</h4>
                        {proj.description && <p className="text-gray-400 text-sm">{proj.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {interviewData.parsedResume?.skills && interviewData.parsedResume.skills.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-wide">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {interviewData.parsedResume.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-500/20 border border-purple-400/50 text-purple-300 px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-purple-500/40 transition-all"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Strengths from AI Analysis */}
              {interviewData.resumeAnalysis?.keyStrengths && (
                <div className="mt-6 pt-6 border-t border-purple-500/30">
                  <p className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-wide">AI Assessment - Key Strengths</p>
                  <ul className="space-y-2">
                    {interviewData.resumeAnalysis.keyStrengths.map((strength, idx) => (
                      <li key={idx} className="text-white flex items-start gap-2">
                        <span className="text-emerald-400 font-bold flex-shrink-0 mt-0.5">✓</span> 
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Practice Button */}
            <button
              onClick={startPractice}
              className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 mb-8 text-lg shadow-xl hover:shadow-emerald-500/50"
            >
              <FiPlay className="text-2xl" />
              Start Practice Mode
            </button>

            {/* Questions by Category */}
            <div className="space-y-4">
              {[
                {
                  key: 'hrQuestions',
                  title: '🎤 HR Questions',
                  description: 'Behavioral and motivation questions',
                },
                {
                  key: 'technicalQuestions',
                  title: '💻 Technical Questions',
                  description: 'Based on your skills and technologies',
                },
                {
                  key: 'projectQuestions',
                  title: '🚀 Project Questions',
                  description: 'About your specific projects',
                },
                {
                  key: 'experienceQuestions',
                  title: '👔 Experience Questions',
                  description: 'About your work and internships',
                },
                {
                  key: 'resumeBasedQuestions',
                  title: '📄 Resume-Based Questions',
                  description: 'Deep dive into your resume items',
                },
              ].map(({ key, title, description }) => (
                <div
                  key={key}
                  className="bg-gradient-to-br from-purple-800/40 to-indigo-800/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-purple-500/20 transition-all"
                >
                  <button
                    onClick={() => toggleCategory(key)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-purple-700/20 transition-all"
                  >
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white">{title}</h3>
                      <p className="text-gray-400 text-sm">{description}</p>
                    </div>
                    <span className="text-cyan-300">
                      {expandedCategory === key ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
                    </span>
                  </button>

                  {expandedCategory === key && (
                    <div className="border-t border-purple-500/30 px-6 py-4 space-y-2 bg-slate-900/30">
                      {interviewData.interviewQuestions[key]?.map((question, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-r from-slate-800/60 to-slate-700/40 rounded-xl p-4 text-white flex items-start gap-3 border border-purple-400/20 hover:border-emerald-400/40 transition-all"
                        >
                          <span className="text-emerald-400 font-bold flex-shrink-0 text-lg">
                            {idx + 1}.
                          </span>
                          <span className="text-gray-200">{question}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setInterviewData(null);
                  fileInputRef.current?.click();
                }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <FiRefreshCw /> Upload New Resume
              </button>
              <button
                onClick={() => deleteInterviewPrep(interviewData.id)}
                className="flex-1 bg-gradient-to-r from-red-500/40 to-orange-500/40 hover:from-red-500/60 hover:to-orange-500/60 border border-red-400/50 text-red-300 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <FiTrash2 /> Delete This Prep
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIInterviewPrep;
