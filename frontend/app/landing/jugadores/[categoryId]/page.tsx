'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLandingScorers, useCategories } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { VideoBackground } from '@/components/landing/VideoBackground';
import Image from 'next/image';
import { useState, useMemo } from 'react';

export default function JugadoresScorerPage() {
  const params = useParams();
  const categoryId = params?.categoryId as string | undefined;
  const [limit, setLimit] = useState(10);

  const { data: categories } = useCategories();
  const { data: scorers, loading, error } = useLandingScorers(categoryId, limit);

  const category = useMemo(
    () => categories?.find((c) => c.id === categoryId),
    [categories, categoryId]
  );

  const breadcrumbItems = [
    { label: 'Landing', href: '/landing' },
    { label: 'Para Jugadores', href: '/landing/jugadores' },
    { label: category?.name || 'Categoría', href: undefined },
  ];

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '⚽';
    }
  };

  return (
    <ErrorBoundary>
      <VideoBackground />
      <div className="relative min-h-screen px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">
              Máximos Goleadores
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              {category?.name || 'Categoría'} - Ranking de los mejores goleadores
            </p>
          </motion.div>

          {/* Scorers List */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-slate-800/50 rounded-xl border border-slate-700/50 animate-pulse"
                />
              ))}
            </motion.div>
          )}

          {error && (
            <EmptyState
              icon="❌"
              title="Error al cargar goleadores"
              description="No pudimos cargar los datos de goleadores. Por favor, intenta recargar la página."
            />
          )}

          {!loading && !error && scorers && scorers.length === 0 && (
            <EmptyState
              icon="⚽"
              title="Sin goleadores"
              description="No hay datos de goleadores disponibles para esta categoría en este momento."
            />
          )}

          {!loading && !error && scorers && scorers.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {scorers.map((scorer, index) => (
                <motion.div
                  key={`${scorer.playerId || scorer.playerName}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    hover
                    className="bg-gradient-to-r from-[#0f172a] to-[#111827] border border-slate-800/85 hover:border-amber-500/60 rounded-2xl p-6 transition-all duration-300"
                  >
                    <div className="flex items-center gap-6">
                      {/* Position Medal */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700/50 text-2xl shrink-0">
                        {getMedalEmoji(scorer.position)}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-black text-white">
                            {scorer.playerName}
                          </h3>
                          {scorer.playerPhoto && (
                            <div className="w-6 h-6 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                              <Image
                                src={scorer.playerPhoto}
                                alt={scorer.playerName}
                                width={24}
                                height={24}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 font-medium">
                          {scorer.teamName}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        <div className="text-3xl font-black text-amber-400 mb-1">
                          {scorer.goals}
                        </div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                          Goles
                        </p>
                        {scorer.points && (
                          <p className="text-xs text-slate-400 mt-1">
                            {scorer.points} puntos
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Load More Button */}
          {!loading && !error && scorers && scorers.length >= limit && limit < 50 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <button
                onClick={() => setLimit((prev) => prev + 10)}
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors duration-200"
              >
                Cargar Más Goleadores
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
