/**
 * TemplatePreviewCard.jsx
 * Renders an accurate scaled-down visual preview of each resume template.
 * Used in ManualBuilder, ResumeParser, and JobOptimizer template selection steps.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

/* ── Mini line placeholders (kept for potential future reuse) ── */
// eslint-disable-next-line no-unused-vars
function Line({ w = 'full', h = 1.5, opacity = 25, color = 'bg-current' }) {
  const widths = { full: 'w-full', '4/5': 'w-4/5', '3/4': 'w-3/4', '2/3': 'w-2/3', '1/2': 'w-1/2', '1/3': 'w-1/3', '2/5': 'w-2/5', '3/5': 'w-3/5' };
  return <div className={`${widths[w] || 'w-full'} rounded-sm ${color}`} style={{ height: `${h}px`, opacity: opacity / 100 }} />;
}

/* ─────────────────────────────────────
   MINIMAL ATS template mini-preview
───────────────────────────────────── */
function MinimalPreview() {
  return (
    <div className="w-full h-full bg-white text-slate-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 px-3 py-2.5 flex-shrink-0">
        <div className="w-3/5 h-2 bg-white/80 rounded mb-1" />
        <div className="flex gap-2">
          <div className="w-1/4 h-1.5 bg-white/40 rounded" />
          <div className="w-1/4 h-1.5 bg-white/40 rounded" />
          <div className="w-1/5 h-1.5 bg-white/40 rounded" />
        </div>
      </div>
      {/* Body */}
      <div className="px-3 py-2 flex-1 space-y-2">
        {/* Summary */}
        <div>
          <div className="w-1/3 h-1.5 bg-slate-600 rounded mb-1" />
          <div className="h-0.5 bg-slate-200 mb-1" />
          <div className="space-y-0.5">
            <div className="w-full h-1 bg-slate-300 rounded opacity-60" />
            <div className="w-4/5 h-1 bg-slate-300 rounded opacity-50" />
          </div>
        </div>
        {/* Education */}
        <div>
          <div className="w-2/5 h-1.5 bg-slate-600 rounded mb-1" />
          <div className="h-0.5 bg-slate-200 mb-1" />
          <div className="flex justify-between">
            <div className="space-y-0.5">
              <div className="w-24 h-1.5 bg-slate-400 rounded" />
              <div className="w-16 h-1 bg-slate-300 rounded opacity-60" />
            </div>
            <div className="w-8 h-1 bg-slate-300 rounded opacity-50" />
          </div>
        </div>
        {/* Skills */}
        <div>
          <div className="w-1/4 h-1.5 bg-slate-600 rounded mb-1" />
          <div className="h-0.5 bg-slate-200 mb-1" />
          <div className="space-y-0.5">
            <div className="w-full h-1 bg-slate-300 rounded opacity-60" />
            <div className="w-3/4 h-1 bg-slate-300 rounded opacity-50" />
          </div>
        </div>
        {/* Experience */}
        <div>
          <div className="w-2/5 h-1.5 bg-slate-600 rounded mb-1" />
          <div className="h-0.5 bg-slate-200 mb-1" />
          <div className="flex justify-between mb-0.5">
            <div className="w-2/3 h-1.5 bg-slate-500 rounded" />
            <div className="w-1/5 h-1 bg-slate-300 rounded opacity-50" />
          </div>
          <div className="space-y-0.5">
            <div className="w-full h-1 bg-slate-200 rounded" />
            <div className="w-4/5 h-1 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   MODERN SIDEBAR template mini-preview
───────────────────────────────────── */
function SidebarPreview() {
  return (
    <div className="w-full h-full bg-white flex overflow-hidden">
      {/* Left sidebar */}
      <div className="bg-blue-700 flex-shrink-0 px-2 py-3 flex flex-col items-center gap-2" style={{ width: '38%' }}>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">U</div>
        <div className="w-full h-1.5 bg-white/60 rounded" />
        <div className="w-4/5 h-1 bg-white/30 rounded" />
        {/* Contact section */}
        <div className="w-full mt-1 space-y-0.5">
          <div className="w-3/5 h-1 bg-blue-300 rounded opacity-70" />
          <div className="h-0.5 bg-white/20 mb-1" />
          <div className="w-full h-1 bg-white/40 rounded" />
          <div className="w-full h-1 bg-white/40 rounded" />
          <div className="w-4/5 h-1 bg-white/40 rounded" />
        </div>
        {/* Skills section */}
        <div className="w-full space-y-0.5">
          <div className="w-2/5 h-1 bg-blue-300 rounded opacity-70" />
          <div className="h-0.5 bg-white/20 mb-1" />
          <div className="w-full h-1 bg-white/35 rounded" />
          <div className="w-full h-1 bg-white/35 rounded" />
          <div className="w-3/4 h-1 bg-white/35 rounded" />
        </div>
      </div>
      {/* Right content */}
      <div className="flex-1 px-2 py-3 space-y-2">
        <div>
          <div className="w-3/4 h-1.5 bg-blue-600 rounded mb-0.5" />
          <div className="h-0.5 bg-blue-100 mb-1" />
          <div className="flex justify-between mb-0.5">
            <div className="w-3/5 h-1.5 bg-slate-500 rounded" />
            <div className="w-1/5 h-1 bg-slate-300 rounded" />
          </div>
          <div className="w-2/5 h-1 bg-slate-300 rounded opacity-60" />
        </div>
        <div>
          <div className="w-3/4 h-1.5 bg-blue-600 rounded mb-0.5" />
          <div className="h-0.5 bg-blue-100 mb-1" />
          <div className="flex justify-between mb-0.5">
            <div className="w-3/5 h-1.5 bg-slate-500 rounded" />
            <div className="w-1/5 h-1 bg-slate-300 rounded" />
          </div>
          <div className="space-y-0.5">
            <div className="w-full h-1 bg-slate-200 rounded" />
            <div className="w-4/5 h-1 bg-slate-200 rounded" />
          </div>
        </div>
        <div>
          <div className="w-1/2 h-1.5 bg-blue-600 rounded mb-0.5" />
          <div className="h-0.5 bg-blue-100 mb-1" />
          <div className="w-3/5 h-1.5 bg-slate-500 rounded mb-0.5" />
          <div className="w-2/5 h-1 bg-slate-300 rounded opacity-60" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   CREATIVE template mini-preview
───────────────────────────────────── */
function CreativePreview() {
  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      {/* Gradient header */}
      <div className="flex-shrink-0 px-3 py-2.5" style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
        <div className="w-2/5 h-2 bg-white/80 rounded mb-1" />
        <div className="w-3/5 h-1 bg-purple-200/60 rounded mb-1.5" />
        <div className="flex gap-2">
          <div className="w-1/5 h-1 bg-white/40 rounded" />
          <div className="w-1/5 h-1 bg-white/40 rounded" />
          <div className="w-1/6 h-1 bg-white/40 rounded" />
        </div>
      </div>
      {/* Two-column body */}
      <div className="flex-1 flex overflow-hidden px-2 py-2 gap-2">
        {/* Left col */}
        <div className="space-y-2" style={{ width: '48%' }}>
          <div>
            <div className="w-3/4 h-1.5 bg-purple-600 rounded mb-0.5" />
            <div className="h-0.5 bg-purple-100 mb-1" />
            {/* Pill skills */}
            <div className="flex flex-wrap gap-0.5">
              {['React', 'Node', 'Python', 'SQL'].map(s => (
                <span key={s} className="text-[5px] px-1 py-0.5 bg-purple-100 text-purple-700 rounded-full">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="w-3/5 h-1.5 bg-purple-600 rounded mb-0.5" />
            <div className="h-0.5 bg-purple-100 mb-1" />
            <div className="w-4/5 h-1.5 bg-slate-500 rounded mb-0.5" />
            <div className="w-3/5 h-1 bg-slate-300 rounded" />
          </div>
        </div>
        {/* Right col */}
        <div className="space-y-2 flex-1">
          <div>
            <div className="w-3/4 h-1.5 bg-purple-600 rounded mb-0.5" />
            <div className="h-0.5 bg-purple-100 mb-1" />
            <div className="border-l-2 border-pink-400 pl-1.5 mb-1">
              <div className="w-4/5 h-1.5 bg-slate-500 rounded mb-0.5" />
              <div className="w-3/5 h-1 bg-slate-300 rounded" />
            </div>
            <div className="border-l-2 border-pink-400 pl-1.5">
              <div className="w-4/5 h-1.5 bg-slate-500 rounded mb-0.5" />
              <div className="w-3/5 h-1 bg-slate-300 rounded" />
            </div>
          </div>
          <div>
            <div className="w-2/4 h-1.5 bg-purple-600 rounded mb-0.5" />
            <div className="h-0.5 bg-purple-100 mb-1" />
            <div className="border-l-2 border-purple-400 pl-1.5">
              <div className="w-full h-1.5 bg-slate-500 rounded mb-0.5" />
              <div className="w-4/5 h-1 bg-slate-300 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   PROFESSIONAL template mini-preview
───────────────────────────────────── */
function ProfessionalPreview() {
  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      {/* Teal header */}
      <div className="flex-shrink-0 px-3 py-2.5 bg-teal-700">
        <div className="w-2/5 h-2 bg-white/80 rounded mb-1" />
        <div className="flex gap-2">
          <div className="w-1/5 h-1 bg-teal-200/60 rounded" />
          <div className="w-1/5 h-1 bg-teal-200/60 rounded" />
          <div className="w-1/4 h-1 bg-teal-200/60 rounded" />
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 px-3 py-2 space-y-2">
        <div>
          <div className="w-1/3 h-1.5 bg-teal-700 rounded mb-0.5" />
          <div className="h-0.5 bg-teal-100 mb-1" />
          <div className="space-y-0.5">
            <div className="w-full h-1 bg-slate-300 rounded opacity-60" />
            <div className="w-4/5 h-1 bg-slate-300 rounded opacity-50" />
          </div>
        </div>
        <div>
          <div className="w-2/5 h-1.5 bg-teal-700 rounded mb-0.5" />
          <div className="h-0.5 bg-teal-100 mb-1" />
          <div className="flex justify-between">
            <div className="space-y-0.5">
              <div className="w-28 h-1.5 bg-slate-500 rounded" />
              <div className="w-20 h-1 bg-slate-300 rounded opacity-60" />
            </div>
            <div className="w-10 h-1 bg-slate-300 rounded opacity-50 mt-0.5" />
          </div>
        </div>
        <div>
          <div className="w-1/4 h-1.5 bg-teal-700 rounded mb-0.5" />
          <div className="h-0.5 bg-teal-100 mb-1" />
          <div className="space-y-0.5">
            <div className="w-full h-1 bg-slate-300 rounded opacity-60" />
            <div className="w-3/4 h-1 bg-slate-300 rounded opacity-50" />
          </div>
        </div>
        <div>
          <div className="w-2/5 h-1.5 bg-teal-700 rounded mb-0.5" />
          <div className="h-0.5 bg-teal-100 mb-1" />
          <div className="flex justify-between mb-0.5">
            <div className="w-3/5 h-1.5 bg-slate-500 rounded" />
            <div className="w-1/5 h-1 bg-slate-300 rounded opacity-50" />
          </div>
          <div className="space-y-0.5">
            <div className="w-full h-1 bg-slate-200 rounded" />
            <div className="w-4/5 h-1 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   EXPORTED CARD — use this in all 3 files
════════════════════════════════════════ */
const PREVIEWS = {
  minimal:      MinimalPreview,
  sidebar:      SidebarPreview,
  creative:     CreativePreview,
  professional: ProfessionalPreview,
};

const BADGES = {
  minimal:      { text: '98% ATS', color: 'bg-green-500' },
  sidebar:      { text: '92% ATS', color: 'bg-blue-500' },
  creative:     { text: '85% ATS', color: 'bg-purple-500' },
  professional: { text: '95% ATS', color: 'bg-teal-500' },
};

export const TEMPLATE_LIST = [
  { id: 'minimal',      name: 'Minimal ATS' },
  { id: 'sidebar',      name: 'Modern Sidebar' },
  { id: 'creative',     name: 'Creative' },
  { id: 'professional', name: 'Professional' },
];

/**
 * @param {Object}   props
 * @param {string}   props.id            - template id
 * @param {string}   props.name          - display name
 * @param {boolean}  props.selected      - is this currently selected?
 * @param {Function} props.onSelect      - callback when card clicked
 * @param {string}   [props.description] - optional subtitle (ManualBuilder)
 */
export default function TemplatePreviewCard({ id, name, selected, onSelect, description }) {
  const badge = BADGES[id] || { text: 'ATS', color: 'bg-slate-500' };
  const Preview = PREVIEWS[id] || MinimalPreview;
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-colors ${
        selected
          ? 'border-blue-500 shadow-xl shadow-blue-500/25'
          : 'border-slate-700 hover:border-slate-500'
      }`}
    >
      {/* Template preview area — fixed height, white background renders the real layout */}
      <div className="relative overflow-hidden bg-white" style={{ height: 140 }}>
        {/* Actual template mini-render */}
        <div className="absolute inset-0">
          <Preview />
        </div>
        {/* Subtle overlay gradient at bottom for depth */}
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
        {/* Selected tick */}
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <FiCheckCircle className="w-4 h-4 text-white" />
          </motion.div>
        )}
        {/* ATS badge */}
        <div className={`absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold text-white ${badge.color}`}>
          {badge.text}
        </div>
      </div>
      {/* Card footer */}
      <div className={`px-3 py-2 transition-colors ${selected ? 'bg-blue-600' : 'bg-slate-800'}`}>
        <p className="text-xs font-semibold text-white">{name}</p>
        {description && <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">{description}</p>}
      </div>
    </motion.div>
  );
}
