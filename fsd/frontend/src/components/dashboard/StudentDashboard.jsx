import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';
import StatsCard from './StatsCard';
import ActivityFeed from './ActivityFeed';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/recommendations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
          <p className="text-slate-400">Here's what's happening with your collaborations.</p>
        </div>
        <div className="p-3 glass-effect rounded-xl flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-xl">⚡</div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Level</p>
            <p className="text-white font-bold">Pro Developer</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Applied" value="12" emoji="📚" color="text-blue-400" />
        <StatsCard label="Joined" value="3" emoji="✅" color="text-green-400" />
        <StatsCard label="Saved" value="24" emoji="❤️" color="text-pink-400" />
        <StatsCard label="Badges" value="8" emoji="⚡" color="text-yellow-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <span>🎯</span>
                <span>Recommended for You</span>
              </h2>
              <Link to="/projects" className="text-sm text-purple-400 hover:text-purple-300 flex items-center space-x-1">
                <span>View all →</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.length > 0 ? recommendations.map((project) => (
                <GlassCard key={project._id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                      {project.matchScore?.toFixed(0)}% Match
                    </span>
                    <span className="text-slate-600 hover:text-pink-500 cursor-pointer transition-colors">❤️</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-slate-800 flex items-center justify-center text-xs">
                          👤
                        </div>
                      ))}
                    </div>
                    <Link to={`/projects/${project._id}`} className="text-xs font-bold text-purple-400 hover:text-purple-300">DETAILS</Link>
                  </div>
                </GlassCard>
              )) : (
                <div className="col-span-2 py-10 text-center glass-effect rounded-2xl">
                  <p className="text-slate-500">No recommendations found yet. Add more skills to your profile!</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
            <ActivityFeed />
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-4">My Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user?.skills?.length > 0 ? user.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400">
                  {skill}
                </span>
              )) : <p className="text-slate-600 text-sm">No skills added yet.</p>}
            </div>
            <Link to="/profile">
              <button className="w-full mt-6 py-2 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 transition-colors">
                EDIT PROFILE
              </button>
            </Link>
          </GlassCard>

          <GlassCard className="p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <h3 className="text-lg font-bold mb-2">Build your Portfolio</h3>
            <p className="text-sm text-slate-400 mb-6">Join a project today to start building your professional track record.</p>
            <Link to="/projects">
              <GradientButton className="w-full py-3 text-sm">Find a Project</GradientButton>
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
