import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap } from 'react-icons/fi';

export default function ToolPreviewCard({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  gradient, 
  onUseNow,
  badge,
  accentColor 
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
    >
      {/* Header Section */}
      <div className={`bg-gradient-to-br ${gradient} p-8 text-white`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Icon size={28} />
          </div>
          {badge && (
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-white/90 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Body Section */}
      <div className="p-6 space-y-4">
        {/* Features List */}
        {features && features.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Features</p>
            <ul className="space-y-2">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className={`text-${accentColor}-500 font-bold mt-0.5`}>✓</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Use Now Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onUseNow}
          className={`w-full mt-6 py-3 px-4 bold rounded-xl bg-gradient-to-r ${gradient} text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95`}
        >
          <FiZap size={18} />
          Use Now
          <FiArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}
