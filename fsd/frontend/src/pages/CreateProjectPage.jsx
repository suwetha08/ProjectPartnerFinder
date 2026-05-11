import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';

const API = import.meta.env.VITE_API_URL;

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  domain: z.string().min(2, 'Domain is required'),
  teamSize: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(2).max(10)),
  deadline: z.string().min(1, 'Deadline is required'),
});

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [techStack, setTechStack] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentTech, setCurrentTech] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
  });

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
      }
      setCurrentSkill('');
    }
  };

  const handleAddTech = (e) => {
    if (e.key === 'Enter' && currentTech.trim()) {
      e.preventDefault();
      if (!techStack.includes(currentTech.trim())) {
        setTechStack([...techStack, currentTech.trim()]);
      }
      setCurrentTech('');
    }
  };

  const onSubmit = async (data) => {
    if (skills.length === 0) return toast.error('Add at least one required skill');
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/api/projects/create`, {
        ...data,
        requiredSkills: skills,
        techStack
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Project created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Launch a New Project</h1>
        <p className="text-slate-400 text-lg">Bring your idea to life by assembling the perfect team.</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <GlassCard className="p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center space-x-2 text-purple-400">
              <span>🚀</span>
              <span>Project Essentials</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-300">Project Title</label>
                <input
                  {...register('title')}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white"
                  placeholder="e.g. Decentralized Voting Platform"
                />
                {errors.title && <p className="text-pink-500 text-xs">{errors.title.message}</p>}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea
                  {...register('description')}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white resize-none"
                  placeholder="Tell us about the project goals, impact, and what you want to build..."
                />
                {errors.description && <p className="text-pink-500 text-xs">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Domain / Category</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-500">📚</span>
                  <input
                    {...register('domain')}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white"
                    placeholder="Web Development"
                  />
                </div>
                {errors.domain && <p className="text-pink-500 text-xs">{errors.domain.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Max Team Size</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-500">👥</span>
                  <input
                    {...register('teamSize')}
                    type="number"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white"
                    placeholder="4"
                  />
                </div>
                {errors.teamSize && <p className="text-pink-500 text-xs">{errors.teamSize.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Application Deadline</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-500">📅</span>
                  <input
                    {...register('deadline')}
                    type="date"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white"
                  />
                </div>
                {errors.deadline && <p className="text-pink-500 text-xs">{errors.deadline.message}</p>}
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="p-8 space-y-4">
            <h3 className="text-xl font-bold flex items-center space-x-2 text-pink-400">
              <span>🎯</span>
              <span>Required Skills</span>
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-500">💻</span>
                <input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white"
                  placeholder="Press Enter to add skills..."
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs flex items-center space-x-2">
                    <span>{skill}</span>
                    <button onClick={() => setSkills(skills.filter(s => s !== skill))}>✕</button>
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 space-y-4">
            <h3 className="text-xl font-bold flex items-center space-x-2 text-blue-400">
              <span>⚙️</span>
              <span>Tech Stack</span>
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-500">💻</span>
                <input
                  value={currentTech}
                  onChange={(e) => setCurrentTech(e.target.value)}
                  onKeyDown={handleAddTech}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white"
                  placeholder="Press Enter to add tech..."
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span key={tech} className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs flex items-center space-x-2">
                    <span>{tech}</span>
                    <button onClick={() => setTechStack(techStack.filter(t => t !== tech))}>✕</button>
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-8 py-3 rounded-xl font-bold border border-white/10 text-slate-400 hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <GradientButton 
            type="submit"
            className="px-10 py-3"
            loading={loading}
          >
            {loading ? 'Creating Project...' : 'Post Project'}
          </GradientButton>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectPage;
