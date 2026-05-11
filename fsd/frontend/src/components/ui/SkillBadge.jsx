import React from 'react';

const SkillBadge = ({ skill, className = "" }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 shadow-sm hover:scale-105 transition-transform cursor-default ${className}`}>
    {skill}
  </span>
);

export default SkillBadge;
