'use client';

import React, { useState } from 'react';
import { Match } from '@/types';
import { MatchCard } from '@/components/sports/MatchCard';
import { MatchCardSkeleton } from '@/components/common/Skeleton';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

/**
 * ParentMatchList Component
 *
 * Displays a filterable list of matches for a specific category.
 * Includes filter buttons for "All", "Scheduled", "In Progress", and "Finished" matches.
 *
 * Props:
 * - matches: Array of Match objects to display
 * - categoryName: Name of the category (for headers)
 * - loading: Show skeleton loaders while data is loading
 * - onSelectMatch: Optional callback when a match is clicked (receives match id)
 */
interface ParentMatchListProps {
  matches: Match[];
  categoryName: string;
  loading: boolean;
  onSelectMatch?: (id: string) => void;
}

type FilterType = 'all' | 'scheduled' | 'in_progress' | 'finished';

export const ParentMatchList: React.FC<ParentMatchListProps> = ({
  matches,
  categoryName,
  loading,
  onSelectMatch,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Filter matches based on status
  const filteredMatches = matches.filter((match) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'scheduled') return match.status === 'scheduled';
    if (activeFilter === 'in_progress') return match.status === 'in_progress';
    if (activeFilter === 'finished') return match.status === 'finished';
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {[...Array(3)].map((_, i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Category Info */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
          Partidos - {categoryName}
        </h2>
        <p className="text-sm text-slate-400">
          {filteredMatches.length} partido{filteredMatches.length !== 1 ? 's' : ''} disponible
          {filteredMatches.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={activeFilter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveFilter('all')}
          aria-pressed={activeFilter === 'all'}
          aria-label="Mostrar todos los partidos"
        >
          Todos ({matches.length})
        </Button>

        <Button
          variant={activeFilter === 'scheduled' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveFilter('scheduled')}
          aria-pressed={activeFilter === 'scheduled'}
          aria-label="Mostrar partidos programados"
        >
          Programados (
          {matches.filter((m) => m.status === 'scheduled').length})
        </Button>

        <Button
          variant={activeFilter === 'in_progress' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveFilter('in_progress')}
          aria-pressed={activeFilter === 'in_progress'}
          aria-label="Mostrar partidos en progreso"
        >
          En progreso ({matches.filter((m) => m.status === 'in_progress').length})
        </Button>

        <Button
          variant={activeFilter === 'finished' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveFilter('finished')}
          aria-pressed={activeFilter === 'finished'}
          aria-label="Mostrar partidos terminados"
        >
          Terminados ({matches.filter((m) => m.status === 'finished').length})
        </Button>
      </div>

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-bold text-slate-200 mb-2">
            {activeFilter === 'scheduled'
              ? 'No hay partidos programados'
              : activeFilter === 'in_progress'
              ? 'No hay partidos en progreso'
              : activeFilter === 'finished'
              ? 'No hay partidos terminados'
              : 'No hay partidos disponibles'}
          </h3>
          <p className="text-slate-400 text-sm">
            {activeFilter === 'finished'
              ? 'No hay partidos terminados en esta categoría.'
              : activeFilter === 'in_progress'
              ? 'No hay partidos en progreso en este momento.'
              : activeFilter === 'scheduled'
              ? 'Vuelve más tarde para ver los próximos partidos.'
              : 'No hay partidos disponibles en esta categoría.'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {filteredMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              onClick={() => onSelectMatch?.(match.id)}
            >
              <MatchCard match={match} delay={index * 0.05} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
