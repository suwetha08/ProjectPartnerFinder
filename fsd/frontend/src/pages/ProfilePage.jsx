import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Summary */}
        <div className="lg:col-span-1 space-y-8">
          <GlassCard className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-500 relative">
              <button className="absolute top-4 right-4 p-2 rounded-lg bg-black/20 text-white hover:bg-black/40 transition-colors">
                📷
              </button>
            </div>
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-6">
                <div className="w-32 h-32 rounded-3xl bg-slate-900 border-4 border-[#0F0F0F] flex items-center justify-center overflow-hidden">
                  <img src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=0D0D0D&color=fff&size=128`} alt="" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-2 right-2 p-2 rounded-lg bg-purple-600 text-white shadow-lg border border-white/10">
                  ✏️
                </button>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                <p className="text-slate-400 text-sm">{user?.department} • {user?.year}th Year</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-slate-400">
                  <span className="text-slate-600">📧</span>
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-400">
                  <span className="text-slate-600">💻</span>
                  <span className="text-sm">github.com/{user?.name.toLowerCase().replace(' ', '')}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-400">
                  <span className="text-slate-600">🌐</span>
                  <span className="text-sm">portfolio.me</span>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Platform Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 text-center">
                    <p className="text-xl font-bold text-white">12</p>
                    <p className="text-[10px] text-slate-500 uppercase">Projects</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 text-center">
                    <p className="text-xl font-bold text-white">4</p>
                    <p className="text-[10px] text-slate-500 uppercase">Badges</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
              <span>🏆</span>
              <span>Achievements</span>
            </h3>
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 hover:text-yellow-500 hover:border-yellow-500/50 transition-all cursor-help text-lg">
                  ⭐
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white">About Me</h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 transition-colors"
              >
                {isEditing ? 'CANCEL' : 'EDIT ABOUT'}
              </button>
            </div>
            {isEditing ? (
              <textarea 
                className="w-full h-40 p-4 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 outline-none text-slate-300 transition-all"
                defaultValue={user?.bio || "I'm a passionate student developer looking to collaborate on interesting projects. My interests include full-stack development, machine learning, and cloud architecture."}
              />
            ) : (
              <p className="text-slate-400 leading-relaxed">
                {user?.bio || "I'm a passionate student developer looking to collaborate on interesting projects. My interests include full-stack development, machine learning, and cloud architecture."}
              </p>
            )}
          </GlassCard>

          <GlassCard className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white">Core Skills</h3>
              <button className="p-2 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white transition-all">
                ➕
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {user?.skills?.map(skill => (
                <div key={skill} className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center space-x-3">
                  <span className="text-sm font-medium">{skill}</span>
                  <button className="hover:text-pink-500">✕</button>
                </div>
              ))}
              {(!user?.skills || user.skills.length === 0) && (
                <p className="text-slate-600 text-sm italic">No skills added to your profile yet.</p>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center space-x-3">
              <span>📚</span>
              <span>Project Experience</span>
            </h3>
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">E-Commerce Microservices</h4>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Backend Lead • Completed 2025</p>
                    </div>
                    <span className="text-green-500 text-lg">✓</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                    Developed a scalable backend using Node.js and RabbitMQ for handling thousands of concurrent orders.
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
