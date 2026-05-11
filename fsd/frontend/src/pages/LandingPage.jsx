import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import SkillBadge from '../components/ui/SkillBadge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const LandingPage = () => {
  const navigate = useNavigate();

  const featuredProjects = [
    { title: 'AI Research Assistant', domain: 'Machine Learning', description: 'Building a RAG-based assistant for academic papers.' },
    { title: 'DeFi Dashboard', domain: 'Blockchain', description: 'Unified interface for tracking multi-chain assets.' },
    { title: 'EcoTrack Mobile', domain: 'Mobile App', description: 'Gamified sustainability tracking for university campus.' },
    { title: 'EduFlow LMS', domain: 'Web Dev', description: 'Modern open-source learning management system.' },
  ];

  const stats = [
    { label: 'Projects Built', value: '500+' },
    { label: 'Active Students', value: '2,000+' },
    { label: 'Departments', value: '15+' },
    { label: 'Successful Teams', value: '350+' },
  ];

  return (
    <div className="space-y-32 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 px-4 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6 inline-block">
            Revolutionizing Student Collaboration
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
            Build Together, <br />
            <span className="gradient-text">Achieve More</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate platform for students to find collaborators, join projects, 
            and build production-ready applications with peers from around the globe.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <GradientButton 
              onClick={() => navigate('/register')}
              className="text-lg px-8 py-4 w-full sm:w-auto"
            >
              Get Started for Free
            </GradientButton>
            <button 
              onClick={() => navigate('/projects')}
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors group text-lg"
            >
              <span>Explore Projects</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </motion.div>

        {/* Floating Badges */}
        <div className="mt-20 flex flex-wrap justify-center gap-4">
          {['React', 'Node.js', 'Python', 'AI/ML', 'Blockchain', 'UI Design'].map((skill, i) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <SkillBadge skill={skill} className="px-6 py-2 text-sm" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-slate-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Projects Carousel */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Featured Projects</h2>
          <p className="text-slate-400">Join top-trending collaborations on the platform.</p>
        </div>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {featuredProjects.map((project, i) => (
            <SwiperSlide key={i}>
              <GlassCard className="p-8 h-full flex flex-col">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-4 inline-block">
                  {project.domain}
                </span>
                <h3 className="text-xl font-bold text-white mb-4">{project.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                  {project.description}
                </p>
                <button 
                  onClick={() => navigate('/projects')}
                  className="flex items-center space-x-2 text-xs font-bold text-white hover:text-purple-400 transition-colors group"
                >
                  <span>VIEW PROJECT</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </GlassCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Features Section */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Why CollabConnect?</h2>
          <p className="text-slate-400">Everything you need to ship projects with a stellar team.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard className="p-8">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-purple-500 text-2xl">
              🎉
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Smart Matching</h3>
            <p className="text-slate-400 leading-relaxed">
              Our AI-powered algorithm finds the perfect projects based on your unique skill set.
            </p>
          </GlassCard>
          <GlassCard className="p-8">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-pink-500 text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Real-time Chat</h3>
            <p className="text-slate-400 leading-relaxed">
              Seamless communication within teams with built-in file sharing and code snippets.
            </p>
          </GlassCard>
          <GlassCard className="p-8">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-blue-500 text-2xl">
              🌐
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Diverse Domains</h3>
            <p className="text-slate-400 leading-relaxed">
              From AI/ML to Web3, find collaborations across every technical and creative domain.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 max-w-5xl mx-auto text-center">
        <GlassCard className="p-16 border-purple-500/30 bg-purple-500/5">
          <h2 className="text-4xl font-bold mb-6">Ready to start your journey?</h2>
          <p className="text-xl text-slate-300 mb-10">
            Join thousands of students building the next generation of software.
          </p>
          <GradientButton onClick={() => navigate('/register')} className="text-lg px-10 py-4">
            Join CollabConnect Today
          </GradientButton>
        </GlassCard>
      </section>
    </div>
  );
};

export default LandingPage;
