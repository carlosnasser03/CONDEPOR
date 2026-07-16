import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-primary/10 text-primary',
  };

  const sizes = {
    sm: 'text-xs px-2 py-1 rounded-full',
    md: 'text-sm px-3 py-1.5 rounded-full',
  };

  return (
    <span className={`font-semibold ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
