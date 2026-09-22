'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

/**
 * KidsScorerList Component
 *
 * Displays top scorers for a category with visual ranking indicators.
 * - Top 1: Gold medal and background
 * - Top 2-3: Silver/Bronze medals
 * - Others: Standard ranking
 *
 * Props:
 * - scorers: Array of scorer objects with position, playerName, teamName, goals
 * - categoryName: Name of the category (for headers)
 * - loading: Show skeleton loaders while data is loading
 */

interface Scorer {
  position: number;
  playerName: string;
  teamName: string;
  goals: number;
  categoryColor?: string;
}

interface KidsScorerListProps {
  scorers: Scorer[];
  categoryName: string;
  loading: boolean;
}

const MedalIcon: React.FC<{ position: number }> = ({ position }) => {
  switch (position) {
    case 1:
      return (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-2xl sm:text-3xl"
        >
          👑
        </motion.div>
      );
    case 2:
      return (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="text-xl sm:text-2xl"
        >
          🥈
        </motion.div>
      );
    case 3:
      return (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          className="text-xl sm:text-2xl"
        >
          🥉
        </motion.div>
      );
    default:
      return null;
  }
};

export const KidsScorerList: React.FC<KidsScorerListProps> = ({
  scorers,
  categoryName,
  loading,
}) => {
  // Skeleton loader component for scorers
  const ScorerSkeleton = () => (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className="bg-[#0f172a]/95 h-24 rounded-2xl border border-slate-800/80 p-4 flex items-center gap-4 shadow-xl"
    >
      <div className="w-12 h-12 rounded-full bg-slate-800/80 shrink-0" />
      <div className="flex-1">
        <div className="w-32 h-5 bg-slate-800/80 rounded mb-2" />
        <div className="w-24 h-4 bg-slate-800/60 rounded" />
      </div>
      <div className="w-12 h-8 bg-slate-800/80 rounded" />
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-5">
        {[...Array(5)].map((_, i) => (
          <ScorerSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (scorers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎯</div>
        <h3 className="text-lg font-bold text-slate-200 mb-2">
          No hay goleadores registrados
        </h3>
        <p className="text-slate-400 text-sm">
          Los goleadores aparecerán aquí cuando se registren partidos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
          Goleadores - {categoryName}
        </h2>
        <p className="text-sm text-slate-400">
          Top {Math.min(scorers.length, 10)} goleadores de la temporada
        </p>
      </div>

      {/* Scorers */}
      <div className="space-y-3 sm:space-y-4">
        {scorers.map((scorer, index) => {
          const isMedalist = scorer.position <= 3;
          const medalColor =
            scorer.position === 1
              ? 'from-yellow-600 to-yellow-700 ring-2 ring-yellow-400/60'
              : scorer.position === 2
                ? 'from-slate-400 to-slate-500 ring-2 ring-slate-300/60'
                : scorer.position === 3
                  ? 'from-orange-600 to-orange-700 ring-2 ring-orange-400/60'
                  : '';

          return (
            <motion.div
              key={`${scorer.playerName}-${scorer.position}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.05,
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
            >
              <Card
                className={`${
                  isMedalist
                    ? `bg-gradient-to-r ${medalColor} border-0 shadow-2xl`
                    : 'hover:border-amber-400/60 cursor-default'
                }`}
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Position Number or Medal */}
                  <div className="flex items-center justify-center shrink-0">
                    {isMedalist ? (
                      <MedalIcon position={scorer.position} />
                    ) : (
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#080d1a] border border-slate-700 flex items-center justify-center"
                        style={{
                          borderColor: scorer.categoryColor || '#f59e0b',
                        }}
                      >
                        <span className="text-xl sm:text-2xl font-black text-slate-300">
                          {scorer.position}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-black text-base sm:text-lg truncate ${
                        isMedalist
                          ? 'text-slate-950'
                          : 'text-white'
                      }`}
                    >
                      {scorer.playerName}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm truncate ${
                        isMedalist
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {scorer.teamName}
                    </p>
                  </div>

                  {/* Goals Display */}
                  <div className="text-right shrink-0">
                    <div
                      className={`text-2xl sm:text-3xl font-black tracking-tight ${
                        isMedalist
                          ? 'text-slate-950'
                          : 'text-amber-400'
                      }`}
                    >
                      {scorer.goals}
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isMedalist
                          ? 'text-slate-800'
                          : 'text-slate-500'
                      }`}
                    >
                      Gol{scorer.goals !== 1 ? 'es' : ''}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
