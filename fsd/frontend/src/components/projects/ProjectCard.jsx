import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Globe,
  Star
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import SkillBadge from '../ui/SkillBadge';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <GlassCard className="h-full flex flex-col p-6 group">
        {/* Status and Match */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              project.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
            }`}>
              {project.status}
            </span>
            {project.matchScore > 70 && (
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                <Star size={10} className="fill-purple-400" />
                <span>Best Match</span>
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center space-x-1">
            <Globe size={10} />
            <span>{project.domain}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 mb-8">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.requiredSkills.slice(0, 3).map(skill => (
              <SkillBadge key={skill} skill={skill} />
            ))}
            {project.requiredSkills.length > 3 && (
              <span className="text-xs text-slate-500 mt-1">+{project.requiredSkills.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
              <img 
                src={project.owner?.profileImage || `https://ui-avatars.com/api/?name=${project.owner?.name}`} 
                alt={project.owner?.name} 
              />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{project.owner?.name}</p>
              <p className="text-[10px] text-slate-500 flex items-center space-x-1">
                <Users size={10} />
                <span>{project.currentTeamSize}/{project.teamSize}</span>
              </p>
            </div>
          </div>
          <Link 
            to={`/projects/${project._id}`}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-purple-600 transition-all"
          >
            <ArrowRight size={20} />
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default ProjectCard;
