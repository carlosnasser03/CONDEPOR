'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLandingMatches, useCategories, useStandings } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ParentMatchList } from '@/components/landing/ParentMatchList';
import { StandingsTable } from '@/components/sports/StandingsTable';
import { VideoBackground } from '@/components/landing/VideoBackground';
import { useMemo } from 'react';

export default function ParentsMatchPage() {
  const params = useParams();
  const categoryId = params?.categoryId as string | undefined;

  const { data: categories } = useCategories();
  const { data: matches, loading, error } = useLandingMatches(categoryId);
  const { data: standings, loading: standingsLoading } = useStandings(categoryId);

  const category = useMemo(
    () => categories?.find((c) => c.id === categoryId),
    [categories, categoryId]
  );

  const breadcrumbItems = [
    { label: 'Landing', href: '/landing' },
    { label: 'Para Padres', href: '/landing/parents' },
    { label: category?.name || 'Categoría', href: undefined },
  ];

  return (
    <ErrorBoundary>
      <VideoBackground />
      <div className="relative min-h-screen px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">
              {category?.name || 'Categoría'}
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              Sigue la clasificación y todos los partidos de esta categoría en tiempo real
            </p>
          </motion.div>

          {/* STANDINGS SECTION */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Clasificación</h2>

            {standingsLoading && (
              <div className="flex justify-center py-16">
                <LoadingSpinner />
              </div>
            )}

            {!standingsLoading && standings && standings.length > 0 && (
              <StandingsTable standings={standings} />
            )}

            {!standingsLoading && (!standings || standings.length === 0) && (
              <EmptyState
                icon="🏆"
                title="Tabla de clasificación no disponible"
                description="La tabla de clasificación aún no está disponible para esta categoría."
              />
            )}
          </motion.section>

          {/* MATCHES SECTION */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            {error && (
              <EmptyState
                icon="❌"
                title="Error al cargar partidos"
                description="No pudimos cargar los partidos. Por favor, intenta recargar la página."
              />
            )}

            {!error && (
              <ParentMatchList
                matches={matches || []}
                categoryName={category?.name || 'Categoría'}
                loading={loading}
              />
            )}
          </motion.section>
        </div>
      </div>
    </ErrorBoundary>
  );
}
