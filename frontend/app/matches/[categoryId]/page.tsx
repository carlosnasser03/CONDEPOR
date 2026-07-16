'use client';

import { useCategoryMatches } from '@/lib/hooks';
import { MatchCard } from '@/components/sports/MatchCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Tabs } from '@/components/ui/Tabs';
import { useState } from 'react';
import Link from 'next/link';

interface PageProps {
  params: {
    categoryId: string;
  };
}

export default function MatchesPage({ params }: PageProps) {
  const { data: allMatches, loading } = useCategoryMatches(params.categoryId);
  const [activeTab, setActiveTab] = useState('scheduled');

  // Filtrar partidos por estado
  const scheduledMatches = allMatches?.filter((m) => m.status === 'scheduled') || [];
  const liveMatches = allMatches?.filter((m) => m.status === 'in_progress') || [];
  const finishedMatches = allMatches?.filter((m) => m.status === 'finished') || [];

  const tabs = [
    { id: 'scheduled', label: `Próximos (${scheduledMatches.length})` },
    { id: 'live', label: `En Juego (${liveMatches.length})` },
    { id: 'finished', label: `Terminados (${finishedMatches.length})` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation back */}
        <div className="mb-6">
          <Link href={`/categories/${params.categoryId}`} className="text-primary font-semibold hover:underline flex items-center gap-1">
            &larr; Volver a Categoría
          </Link>
        </div>

        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Partidos del Campeonato</h1>
        <p className="text-gray-600 mb-8">
          Encuentros programados, partidos en vivo y resultados finalizados
        </p>

        {loading && <LoadingSpinner />}

        {!loading && allMatches && (
          <Tabs tabs={tabs} defaultTab="scheduled" onChange={setActiveTab}>
            {/* Próximos */}
            {activeTab === 'scheduled' && (
              <>
                {scheduledMatches.length === 0 ? (
                  <EmptyState
                    icon="📅"
                    title="Sin partidos próximos"
                    description="No hay partidos pendientes por disputar"
                  />
                ) : (
                  <div className="grid gap-6">
                    {scheduledMatches.map((match, index) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        delay={index * 0.05}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* En Juego */}
            {activeTab === 'live' && (
              <>
                {liveMatches.length === 0 ? (
                  <EmptyState
                    icon="⚽"
                    title="Sin partidos en vivo"
                    description="No hay partidos disputándose en este momento"
                  />
                ) : (
                  <div className="grid gap-6">
                    {liveMatches.map((match, index) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        delay={index * 0.05}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Terminados */}
            {activeTab === 'finished' && (
              <>
                {finishedMatches.length === 0 ? (
                  <EmptyState
                    icon="✓"
                    title="Sin resultados"
                    description="Aún no se han finalizado partidos en esta categoría"
                  />
                ) : (
                  <div className="grid gap-6">
                    {finishedMatches.map((match, index) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        delay={index * 0.05}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </Tabs>
        )}
      </div>
    </div>
  );
}
