import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-10 pt-20 pb-10 border-t border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-white text-sm font-bold">CC</span>
              </div>
              <span className="text-xl font-bold">CollabConnect</span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6">
              Empowering students to build the future through collaboration. Find your team, share your skills, and create something amazing.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 transition-colors text-slate-300 text-sm font-bold">
                GH
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 transition-colors text-slate-300 text-sm font-bold">
                TW
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 transition-colors text-slate-300 text-sm font-bold">
                LI
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/projects" className="text-slate-400 hover:text-purple-400 transition-colors">Explore Projects</Link></li>
              <li><Link to="/create-project" className="text-slate-400 hover:text-purple-400 transition-colors">Post a Project</Link></li>
              <li><Link to="/projects" className="text-slate-400 hover:text-purple-400 transition-colors">Find Collaborators</Link></li>
              <li><Link to="/projects" className="text-slate-400 hover:text-purple-400 transition-colors">Hackathons</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">Collaboration Guide</a></li>
              <li><a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">Skill Assessments</a></li>
              <li><a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">API Documentation</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-6">Stay Updated</h4>
            <p className="text-slate-400 mb-6">Get the latest project opportunities delivered to your inbox.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none transition-colors"
              />
              <button className="absolute right-2 top-2 p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-white text-xs font-bold">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© 2026 CollabConnect. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
