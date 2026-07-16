import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  animationDelay?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = true,
  animationDelay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.4 }}
      onClick={onClick}
      className={`
        bg-white rounded-xl p-6 shadow-card
        border border-gray-100
        ${hover ? 'hover:shadow-elevated hover:-translate-y-1 cursor-pointer transition-all' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};
