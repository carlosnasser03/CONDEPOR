'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * CategoryCardSkeleton
 * - Mimics the exact layout of CategoryCard during loading state (O3)
 */
export const CategoryCardSkeleton: React.FC = () => (
  <motion.div
    animate={{ opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    className="bg-[#0f172a]/95 h-56 rounded-2xl border border-slate-800/80 p-6 flex flex-col items-center justify-between shadow-xl"
  >
    <div className="w-14 h-14 rounded-2xl bg-slate-800/80 mb-4" />
    <div className="w-3/4 h-6 rounded-lg bg-slate-800/80 mb-2" />
    <div className="w-full h-4 rounded bg-slate-800/60 mb-1" />
    <div className="w-2/3 h-4 rounded bg-slate-800/60 mb-4" />
    <div className="w-28 h-5 rounded-full bg-slate-800/80 mt-auto" />
  </motion.div>
);

/**
 * MatchCardSkeleton
 * - Mimics the exact layout of MatchCard scoreboard during loading state (O3)
 */
export const MatchCardSkeleton: React.FC = () => (
  <motion.div
    animate={{ opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    className="bg-gradient-to-b from-[#111827] to-[#0b111e] border-2 border-slate-800 rounded-2xl overflow-hidden shadow-xl"
  >
    <div className="h-9 bg-[#080d1a] border-b border-slate-800/80 px-6 flex items-center justify-between">
      <div className="w-36 h-3.5 bg-slate-800/80 rounded" />
      <div className="w-28 h-3.5 bg-slate-800/80 rounded" />
    </div>
    <div className="p-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 flex-1 justify-end">
        <div className="w-24 h-5 bg-slate-800/80 rounded" />
        <div className="w-10 h-10 rounded-full bg-slate-800/80 shrink-0" />
      </div>
      <div className="w-28 h-12 rounded-2xl bg-[#080d1a] border border-slate-800/80 shrink-0" />
      <div className="flex items-center gap-3.5 flex-1 justify-start">
        <div className="w-10 h-10 rounded-full bg-slate-800/80 shrink-0" />
        <div className="w-24 h-5 bg-slate-800/80 rounded" />
      </div>
    </div>
  </motion.div>
);

/**
 * PlayerCardSkeleton
 * - Mimics the exact layout of PlayerCard during loading state (O3)
 */
export const PlayerCardSkeleton: React.FC = () => (
  <motion.div
    animate={{ opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    className="h-80 bg-gradient-to-b from-[#111827] to-[#0b111e] border-2 border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl"
  >
    <div>
      <div className="w-full h-44 rounded-xl bg-slate-800/80 mb-4" />
      <div className="w-16 h-5 rounded-full bg-slate-800/80 mb-2.5" />
      <div className="w-3/4 h-6 rounded-lg bg-slate-800/80" />
    </div>
    <div className="w-full h-8 rounded-lg bg-[#080d1a] border border-slate-800/80 mt-4" />
  </motion.div>
);

/**
 * StandingsTableSkeleton
 * - Mimics the exact layout of StandingsTable during loading state (O3)
 */
export const StandingsTableSkeleton: React.FC = () => (
  <motion.div
    animate={{ opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    className="bg-[#0b111e] rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl"
  >
    <div className="h-12 bg-gradient-to-r from-[#111827] to-[#1e293b] border-b border-slate-800/80 px-6 flex items-center justify-between" />
    <div className="p-4 space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-14 bg-[#111827]/60 rounded-xl border border-slate-800/50 flex items-center px-4 gap-4">
          <div className="w-6 h-6 rounded bg-slate-800/80 shrink-0" />
          <div className="w-8 h-8 rounded-full bg-slate-800/80 shrink-0" />
          <div className="w-40 h-5 bg-slate-800/80 rounded flex-1" />
          <div className="w-12 h-5 bg-slate-800/80 rounded shrink-0" />
          <div className="w-12 h-5 bg-slate-800/80 rounded shrink-0" />
        </div>
      ))}
    </div>
  </motion.div>
);
