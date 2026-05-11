import React from 'react';
import GlassCard from '../ui/GlassCard';

const StatsCard = ({ label, value, emoji, color }) => {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-white/5 text-2xl ${color}`}>
          {emoji}
        </div>
      </div>
    </GlassCard>
  );
};

export default StatsCard;
