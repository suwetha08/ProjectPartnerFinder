import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import GradientButton from '../ui/GradientButton';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Explore', path: '/projects' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Create', path: '/create-project' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'backdrop-blur-md bg-black/40 border-b border-white/10 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white font-bold">
              CC
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Collab<span className="text-purple-500">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all text-sm group"
            >
              <span>🔍</span>
              <span className="pr-12">Search projects...</span>
              <kbd className="hidden lg:inline-block px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold border border-white/10">⌘K</kbd>
            </button>
            {user && navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-slate-300 hover:text-white transition-colors flex items-center space-x-1"
              >
                <span>{link.name}</span>
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 border-l border-white/10 pl-8">
              {user ? (
                <>
                  <button 
                    onClick={() => { if (user?.role === 'project_owner') navigate('/dashboard?applications=true'); else navigate('/notifications'); }}
                    className="relative p-2 text-slate-400 hover:text-white transition-colors">
                    🔔
                    <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-black" />
                  </button>
                  <Link to="/profile" className="flex items-center space-x-2 group">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:border-purple-500 transition-colors">
                      👤
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-pink-500 transition-colors"
                  >
                    🚶
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Login</Link>
                  <GradientButton onClick={() => navigate('/register')}>Join Now</GradientButton>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-300 text-2xl"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsSearchOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center space-x-4">
                <span className="text-purple-500 text-2xl">🔍</span>
                <input 
                  autoFocus
                  placeholder="Search projects, skills, or collaborators..."
                  className="flex-1 bg-transparent border-none outline-none text-xl text-white placeholder-slate-600"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 hover:text-white transition-colors"
                >
                  ESC
                </button>
              </div>
              <div className="p-8 text-center text-slate-500">
                <p>Start typing to search the platform...</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#0F0F0F]/95 backdrop-blur-xl border-b border-white/10 py-6 px-4 space-y-4"
          >
            {user && navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xl font-medium text-slate-300"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <button onClick={handleLogout} className="text-pink-500 font-medium">Logout</button>
              ) : (
                <div className="space-y-4">
                  <Link to="/login" className="block text-slate-300">Login</Link>
                  <GradientButton className="w-full" onClick={() => navigate('/register')}>Join Now</GradientButton>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
