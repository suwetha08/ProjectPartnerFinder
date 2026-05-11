import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import StatsCard from './StatsCard';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import GradientButton from '../ui/GradientButton';
import { toast } from 'react-hot-toast';

const ProjectOwnerDashboard = ({ showApplications, onCloseApplications }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myProjects, setMyProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, {
          params: { owner: user._id },
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyProjects(data.filter(p => p.owner?._id === user._id));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchMyProjects();
  }, [user._id]);

  useEffect(() => {
    if (showApplications) fetchAllApplications();
  }, [showApplications]);

  const fetchAllApplications = async () => {
    setLoadingApps(true);
    try {
      const { data: projects } = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, {
        params: { owner: user._id },
        headers: { Authorization: `Bearer ${token}` }
      });
      const myProjs = projects.filter(p => p.owner?._id === user._id);

      const appResults = await Promise.all(
        myProjs.map(p =>
          axios.get(`${import.meta.env.VITE_API_URL}/applications/${p._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.data.map(app => ({ ...app, projectTitle: p.title, projectId: p._id })))
            .catch(() => [])
        )
      );
      setApplications(appResults.flat());
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoadingApps(false);
    }
  };

  const handleDecision = async (applicationId, status) => {
    setProcessingId(applicationId);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/applications/${applicationId}/${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Application ${status}!`);
      setApplications(prev =>
        prev.map(app => app._id === applicationId ? { ...app, status } : app)
      );
      // refresh projects to update team members
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, {
        params: { owner: user._id },
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyProjects(data.filter(p => p.owner?._id === user._id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Owner Dashboard</h1>
          <p className="text-slate-400">Manage your projects and team applications.</p>
        </div>
        <GradientButton onClick={() => navigate('/create-project')} className="flex items-center space-x-2">
          <span>➕</span>
          <span>New Project</span>
        </GradientButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Active Projects" value={myProjects.length} emoji="📁" color="text-purple-400" />
        <StatsCard label="Pending Applications" value={pendingCount} emoji="📬" color="text-pink-400" />
        <StatsCard label="Total Members" value={myProjects.reduce((acc, p) => acc + (p.team?.length || 0), 0)} emoji="👥" color="text-blue-400" />
        <StatsCard label="Total Applications" value={applications.length} emoji="📋" color="text-green-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold">My Projects</h2>
          {myProjects.map((project) => (
            <GlassCard key={project._id} className="p-6 group">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                      {project.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      project.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-1">{project.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span>👥 {project.currentTeamSize}/{project.teamSize} members</span>
                    <span>📅 {new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex -space-x-2">
                  {project.team?.slice(0, 5).map((member, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-slate-800 overflow-hidden">
                      <img src={member.profileImage || `https://ui-avatars.com/api/?name=${member.name}`} alt="" />
                    </div>
                  ))}
                  {(!project.team || project.team.length === 0) && (
                    <span className="text-xs text-slate-600">No members yet</span>
                  )}
                </div>
                <Link to={`/projects/${project._id}`} className="text-xs font-bold text-purple-400 hover:text-purple-300">
                  PROJECT PAGE →
                </Link>
              </div>
            </GlassCard>
          ))}
          {myProjects.length === 0 && (
            <div className="py-20 text-center glass-effect rounded-2xl">
              <p className="text-slate-500">You haven't created any projects yet.</p>
              <button onClick={() => navigate('/create-project')} className="mt-4 text-purple-400 hover:underline">
                Create your first project
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-6">⚡ Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => fetchAllApplications() || onCloseApplications(true)}
                className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all text-sm font-medium flex items-center justify-between"
              >
                <span>View All Applications</span>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-xs font-bold">{pendingCount}</span>
                )}
              </button>
              <Link to="/chat" className="block w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all text-sm font-medium">
                Team Communications
              </Link>
              <Link to="/create-project" className="block w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all text-sm font-medium">
                Create New Project
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Applications Panel Modal */}
      <AnimatePresence>
        {showApplications && (
          <div className="fixed inset-0 z-[100] flex items-start justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => onCloseApplications(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl h-full bg-[#0f0f0f] border-l border-white/10 overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0f0f0f] z-10">
                <div>
                  <h2 className="text-xl font-bold text-white">📬 Applications</h2>
                  <p className="text-slate-400 text-sm">{pendingCount} pending review</p>
                </div>
                <button onClick={() => onCloseApplications(false)} className="text-slate-400 hover:text-white text-2xl">✕</button>
              </div>

              <div className="p-6 space-y-4">
                {loadingApps ? (
                  <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">
                    <p className="text-4xl mb-4">📭</p>
                    <p>No applications yet.</p>
                  </div>
                ) : (
                  applications.map((app) => (
                    <GlassCard key={app._id} className="p-5">
                      <div className="flex items-start space-x-4">
                        <img
                          src={app.applicant?.profileImage || `https://ui-avatars.com/api/?name=${app.applicant?.name}&background=0D0D0D&color=fff`}
                          className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                          alt=""
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-white">{app.applicant?.name}</h4>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              app.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-xs text-purple-400 mb-1">📁 {app.projectTitle}</p>
                          <p className="text-xs text-slate-500 mb-1">{app.applicant?.department} • Year {app.applicant?.year}</p>
                          {app.applicant?.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {app.applicant.skills.slice(0, 4).map(s => (
                                <span key={s} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px]">{s}</span>
                              ))}
                            </div>
                          )}
                          {app.message && (
                            <p className="text-sm text-slate-400 bg-white/5 rounded-xl p-3 mb-3 italic">"{app.message}"</p>
                          )}
                          {app.status === 'pending' && (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleDecision(app._id, 'accepted')}
                                disabled={processingId === app._id}
                                className="flex-1 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-bold hover:bg-green-500/30 transition-all disabled:opacity-50"
                              >
                                {processingId === app._id ? '...' : '✓ Accept'}
                              </button>
                              <button
                                onClick={() => handleDecision(app._id, 'rejected')}
                                disabled={processingId === app._id}
                                className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-all disabled:opacity-50"
                              >
                                {processingId === app._id ? '...' : '✕ Reject'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectOwnerDashboard;
