import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between min-h-[calc(100-200px)]">
      {/* Illustration Side */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:block w-1/2 pr-20"
      >
        <h2 className="text-4xl font-bold mb-6 tracking-tight">
          Accelerate Your <br />
          <span className="gradient-text">Innovation Journey</span>
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-8">
          Join a community of students who are turning ideas into reality. 
          Connect with collaborators who share your passion.
        </p>
        <div className="space-y-4">
          {[
            'Personalized project recommendations',
            'Real-time team collaboration',
            'Showcase your project portfolio'
          ].map((text) => (
            <div key={text} className="flex items-center space-x-3 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                ✓
              </div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Form Side */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/2 max-w-md"
      >
        <GlassCard className="p-8 border-white/10 shadow-purple-500/5">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-slate-400">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-500">✉️</span>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white"
                  placeholder="name@university.edu"
                />
              </div>
              {errors.email && <p className="text-pink-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" size="xs" className="text-xs text-purple-400 hover:text-purple-300">Forgot password?</Link>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-500">🔒</span>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-pink-500 text-xs">{errors.password.message}</p>}
            </div>

            <GradientButton 
              type="submit"
              className="w-full py-4 text-lg"
              loading={loading}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </GradientButton>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0F0F0F] px-2 text-slate-500">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <span>🐙</span>
                <span>GitHub</span>
              </button>
              <button type="button" className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <span>🔍</span>
                <span>Google</span>
              </button>
            </div>

            <p className="text-center text-slate-400 text-sm mt-8">
              Don't have an account? <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">Create one</Link>
            </p>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default LoginPage;
