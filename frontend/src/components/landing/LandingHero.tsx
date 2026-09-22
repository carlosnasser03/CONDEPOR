'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * LandingHero Component
 *
 * Reusable hero section component for landing pages.
 * Provides a centered layout with title, description, and flexible content area.
 *
 * Props:
 * - title: Main heading text
 * - description: Optional subtitle or descriptive text
 * - children: Optional content (buttons, images, etc)
 * - imageSrc: Optional background image URL
 * - backgroundColor: Optional background color (defaults to transparent)
 */
interface LandingHeroProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  imageSrc?: string;
  backgroundColor?: string;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  title,
  description,
  children,
  imageSrc,
  backgroundColor = 'transparent',
}) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor,
        backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for text readability if background image exists */}
      {imageSrc && (
        <div className="absolute inset-0 bg-black/40 z-0" />
      )}

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight"
        >
          {title}
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-base sm:text-lg text-slate-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>
        )}

        {/* Children Content (Buttons, etc) */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center flex-wrap"
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};
