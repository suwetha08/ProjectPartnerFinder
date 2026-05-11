import React from 'react';

const GlassCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-2xl border border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 ${className}`}>
    {children}
  </div>
);

export default GlassCard;
