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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'project_owner']),
  department: z.string().min(2, 'Department is required'),
  year: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().min(1).max(5)),
});

const RegisterPage = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'student' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(msg);
      console.error('Registration error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between min-h-[calc(100vh-200px)]">
      {/* Content Side */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:block w-5/12 pr-10"
      >
        <h2 className="text-5xl font-bold mb-8 leading-tight">
          Join the <br />
          <span className="gradient-text">Collaboration <br />Revolution</span>
        </h2>
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400 shrink-0">
              📚
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">Learn by Doing</h4>
              <p className="text-slate-400 text-sm">Apply your theoretical knowledge to real-world production projects with talented peers.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-600/20 flex items-center justify-center text-pink-400 shrink-0">
              📅
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">Expand Network</h4>
              <p className="text-slate-400 text-sm">Build lasting professional relationships with students across different departments.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form Side */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-7/12 max-w-2xl"
      >
        <GlassCard className="p-8 md:p-10 border-white/10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-slate-400">Fill in the details to join CollabConnect</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-500">👤</span>
                  <input
                    {...register('name')}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-pink-500 text-xs">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-500">✉️</span>
                  <input
                    {...register('email')}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white"
                    placeholder="john@edu.com"
                  />
                </div>
                {errors.email && <p className="text-pink-500 text-xs">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Department</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-500">📚</span>
                  <input
                    {...register('department')}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white"
                    placeholder="Computer Science"
                  />
                </div>
                {errors.department && <p className="text-pink-500 text-xs">{errors.department.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Year of Study</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-500">📅</span>
                  <select
                    {...register('year')}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-500 outline-none transition-colors text-white appearance-none"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                {errors.year && <p className="text-pink-500 text-xs">{errors.year.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Register As</label>
                <div className="flex space-x-4">
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" value="student" {...register('role')} className="hidden peer" />
                    <div className="p-3 text-center rounded-xl bg-white/5 border border-white/10 peer-checked:bg-purple-600/20 peer-checked:border-purple-500 transition-all text-sm">
                      Student
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" value="project_owner" {...register('role')} className="hidden peer" />
                    <div className="p-3 text-center rounded-xl bg-white/5 border border-white/10 peer-checked:bg-pink-600/20 peer-checked:border-pink-500 transition-all text-sm">
                      Project Lead
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <GradientButton 
              type="submit"
              className="w-full py-4 text-lg mt-4"
              loading={loading}
            >
              {loading ? 'Creating Account...' : 'Get Started'}
            </GradientButton>

            <p className="text-center text-slate-400 text-sm">
              Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in</Link>
            </p>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
