import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Grid, List as ListIcon, X } from 'lucide-react';
import axios from 'axios';
import ProjectCard from '../components/projects/ProjectCard';
import GlassCard from '../components/ui/GlassCard';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    domain: '',
    status: 'open'
  });

  const domains = ['Web Development', 'AI/ML', 'Mobile Apps', 'Blockchain', 'UI/UX Design', 'Data Science'];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, {
          params: { ...filters, search: searchTerm }
        });
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Explore Projects</h1>
          <p className="text-slate-400">Discover your next big collaboration.</p>
        </div>
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text"
            placeholder="Search by title, skills, or tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none transition-all text-white shadow-2xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-white flex items-center space-x-2">
                <Filter size={18} className="text-purple-500" />
                <span>Filters</span>
              </h3>
              <button 
                onClick={() => setFilters({ domain: '', status: 'open' })}
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="space-y-8">
              {/* Domains */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Domain</label>
                <div className="space-y-2">
                  {domains.map(domain => (
                    <button
                      key={domain}
                      onClick={() => setFilters({ ...filters, domain: filters.domain === domain ? '' : domain })}
                      className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${
                        filters.domain === domain 
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' 
                          : 'text-slate-400 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</label>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setFilters({ ...filters, status: 'open' })}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      filters.status === 'open' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    OPEN
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, status: 'in_progress' })}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      filters.status === 'in_progress' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    ACTIVE
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border-blue-500/20">
            <h4 className="text-white font-bold mb-2">Need a Team?</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">Can't find what you're looking for? Start your own project and invite peers.</p>
            <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all">
              POST PROJECT
            </button>
          </GlassCard>
        </div>

        {/* Project Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 glass-effect rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
              {projects.length === 0 && (
                <div className="py-32 text-center glass-effect rounded-3xl">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-slate-700">
                    <Search size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
                  <p className="text-slate-500">Try adjusting your filters or search term.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
