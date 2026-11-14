import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiSend, FiUser, FiCpu, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import api from '../../utils/api';

const suggestedQuestions = [
  'What career options are best for a CSE graduate?',
  'How do I transition from IT to Data Science?',
  'What skills should I learn for a software engineering role?',
  'How to prepare for campus placements in 3 months?',
  'Which is better — full-stack development or backend only?',
  'How to get an internship with no prior experience?',
];

const WELCOME_MSG = {
  from: 'bot',
  text: "Hi! I'm CareerCompass 👋 — your AI career counselor. Ask me anything about career planning, skill development, job preparation, entrance exams, or industry trends. I'm here to help!",
};

export default function CareerGuidance() {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (text) => {
    const question = (text || input).trim();
    if (!question || isSending) return;

    const userMsg = { from: 'user', text: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);
    setError('');

    // Build message history for the API (exclude welcome message)
    const history = [...messages.filter((m) => m.from !== 'system'), userMsg]
      .map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text }));

    try {
      const { data } = await api.post('/career-guidance/chat', { messages: history });
      setMessages((prev) => [...prev, { from: 'bot', text: data.content }]);
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        'Something went wrong. Please check your connection and try again.';
      setError(errMsg);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <FiMessageSquare size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Career Guidance</h1>
              <p className="text-slate-500 text-sm">AI career advisor powered by CareerCompass</p>
            </div>
          </div>
          <button
            onClick={() => { setMessages([WELCOME_MSG]); setError(''); }}
            title="Clear conversation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 text-xs transition-all border border-slate-200 dark:border-slate-700"
          >
            <FiTrash2 size={13} /> Clear
          </button>
        </div>
      </motion.div>

      {/* Suggested questions — shown only before any user message */}
      {!messages.some((m) => m.from === 'user') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-5"
        >
          <p className="text-slate-500 text-xs font-medium mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={isSending}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs hover:border-teal-500/40 hover:text-teal-400 transition-all disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-sm"
        >
          <FiAlertCircle size={15} className="mt-0.5 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 ml-2">✕</button>
        </motion.div>
      )}

      {/* Chat window */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden"
        style={{ height: '460px' }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* avatar */}
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.from === 'bot'
                    ? 'bg-gradient-to-br from-teal-500 to-cyan-500'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}
              >
                {msg.from === 'bot' ? (
                  <FiCpu size={14} className="text-white" />
                ) : (
                  <FiUser size={14} className="text-white" />
                )}
              </div>

              {/* bubble */}
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.from === 'bot'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm'
                    : 'bg-gradient-to-br from-teal-600 to-cyan-600 text-white rounded-tr-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isSending && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <FiCpu size={14} className="text-white" />
              </div>
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-3 flex items-end gap-2">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your career, skills, or job preparation..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500/50 resize-none"
            style={{ maxHeight: '100px' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isSending}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <FiSend size={16} />
          </button>
        </div>
      </motion.div>

      <p className="text-slate-500 text-xs text-center mt-3">
        Powered by Groq LLaMA 3.3 70B · CareerCompass AI
      </p>
    </div>
  );
}
