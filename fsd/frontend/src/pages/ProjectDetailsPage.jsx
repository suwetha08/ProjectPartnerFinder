import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import SkillBadge from '../components/ui/SkillBadge';

const API = import.meta.env.VITE_API_URL;

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axios.get(`${API}/api/projects/${id}`);
        setProject(data);
      } catch (error) {
        toast.error('Project not found');
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  const handleApply = async () => {
    if (!applicationMessage.trim()) return toast.error('Please write a message');
    
    setApplying(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/api/applications/${id}/apply`, {
        message: applicationMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>;

  const isOwner = user?._id === project.owner?._id;
  const isOnTeam = project.team?.some(m => m._id === user?._id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span>Back to Projects</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase mb-4 inline-block">
                  {project.domain}
                </span>
                <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
                <div className="flex items-center space-x-6 text-slate-400 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>📅</span>
                    <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>👥</span>
                    <span>{project.currentTeamSize}/{project.teamSize} members</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-300">
                  🔖
                </button>
                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-300">
                  📤
                </button>
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-10">
              <h3 className="text-xl font-bold text-white mb-4">About the Project</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
              <div>
                <h4 className="text-white font-bold mb-4 flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Required Skills</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map(skill => (
                    <SkillBadge key={skill} skill={skill} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4 flex items-center space-x-2">
                  <span>💻</span>
                  <span>Tech Stack</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Discussion / Comments Placeholder */}
          <section>
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <span>💬</span>
              <span>Discussion</span>
            </h3>
            <GlassCard className="p-8 text-center text-slate-500">
              <p>Sign in to join the discussion and ask questions about this project.</p>
            </GlassCard>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Owner Info */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-6">Project Lead</h3>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-0.5">
                <img 
                  src={project.owner?.profileImage || `https://ui-avatars.com/api/?name=${project.owner?.name}&background=0D0D0D&color=fff`} 
                  className="w-full h-full rounded-2xl object-cover border-2 border-[#1a1a1a]"
                  alt=""
                />
              </div>
              <div>
                <h4 className="text-white font-bold">{project.owner?.name}</h4>
                <p className="text-xs text-slate-500">{project.owner?.email}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6 line-clamp-3">{project.owner?.bio || 'Passionate developer looking to build innovative solutions.'}</p>
            <Link to={`/profile/${project.owner?._id}`}>
              <button className="w-full py-3 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 transition-colors">
                VIEW PROFILE
              </button>
            </Link>
          </GlassCard>

          {/* Action Card */}
          <GlassCard className="p-8 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 border-purple-500/30">
            <h3 className="text-xl font-bold mb-4">Want to contribute?</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Join this project to gain real-world experience and build something amazing with {project.owner?.name}.
            </p>
            {isOwner ? (
              <GradientButton onClick={() => navigate('/dashboard')} className="w-full">
                Manage Project
              </GradientButton>
            ) : isOnTeam ? (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-center font-bold">
                You are on this team
              </div>
            ) : (
              <GradientButton 
                onClick={() => user ? setShowApplyModal(true) : navigate('/login')} 
                className="w-full"
              >
                Apply to Join Team
              </GradientButton>
            )}
            <p className="text-[10px] text-slate-600 text-center mt-6 flex items-center justify-center space-x-1">
              🛡️
              <span>Application process is secure and transparent</span>
            </p>
          </GlassCard>

          {/* Current Team */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
              <span>Current Team</span>
              <span className="text-xs text-slate-500">{project.currentTeamSize}/{project.teamSize}</span>
            </h3>
            <div className="space-y-4">
              {project.team?.map((member) => (
                <div key={member._id} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                      <img src={member.profileImage || `https://ui-avatars.com/api/?name=${member.name}`} alt="" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{member.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{member.role || 'Member'}</p>
                    </div>
                  </div>
                  <span className="text-slate-700 opacity-0 group-hover:opacity-100 transition-all">→</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowApplyModal(false)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-lg bg-[#121212] border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-2">Apply for {project.title}</h2>
            <p className="text-slate-400 text-sm mb-6">Tell the project lead why you're a good fit for this team.</p>
            
            <div className="space-y-4">
              <textarea
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white resize-none h-40"
                placeholder="I'm interested because I have experience with..."
              />
              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 font-bold transition-all"
                >
                  Cancel
                </button>
                <GradientButton 
                  onClick={handleApply}
                  className="flex-1 py-3"
                  loading={applying}
                >
                  {applying ? 'Sending...' : 'Send Application'}
                </GradientButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
