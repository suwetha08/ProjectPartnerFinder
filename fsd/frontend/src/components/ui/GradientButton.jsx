import React from 'react';
import { motion } from 'framer-motion';

const GradientButton = ({ children, onClick, className = "", type = "button", loading = false, disabled = false }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    type={type}
    onClick={onClick}
    disabled={loading || disabled}
    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </motion.button>
);

export default GradientButton;
