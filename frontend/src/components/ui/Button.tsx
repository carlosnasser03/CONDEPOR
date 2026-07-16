'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  loading = false,
}) => {
  const baseStyle = `
    inline-flex items-center justify-center font-black tracking-wide rounded-2xl
    transition-colors duration-200 cursor-pointer select-none
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#080d1a]
  `;

  const variants = {
    primary: 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/25 border border-amber-300/40 focus:ring-amber-400',
    secondary: 'bg-[#1e293b]/90 text-white hover:bg-[#253348] border border-slate-700/80 shadow-md focus:ring-slate-400',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/25 border border-emerald-400/30 focus:ring-emerald-400',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 shadow-lg shadow-red-500/25 border border-red-400/30 focus:ring-red-400',
    outline: 'border-2 border-amber-500/80 bg-transparent text-amber-400 hover:bg-amber-500 hover:text-slate-950 shadow-sm focus:ring-amber-400',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      whileHover={disabled || loading ? {} : { scale: 1.04, y: -1.5 }}
      whileTap={disabled || loading ? {} : { scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Procesando...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};
