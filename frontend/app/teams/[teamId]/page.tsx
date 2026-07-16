'use client';

import { useTeamPlayers } from '@/lib/hooks';
import { PlayerCard } from '@/components/sports/PlayerCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import Link from 'next/link';

interface PageProps {
  params: {
    teamId: string;
  };
}

export default function TeamPlayersPage({ params }: PageProps) {
  const { data: players, loading, error } = useTeamPlayers(params.teamId);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation back */}
        <div className="mb-6">
          <Link href="/" className="text-primary font-semibold hover:underline flex items-center gap-1">
            &larr; Volver al Inicio
          </Link>
        </div>

        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Plantilla y Jugadores</h1>
        <p className="text-gray-600 mb-8">
          Lista oficial de atletas y posiciones del club en la temporada activa
        </p>

        {loading && <LoadingSpinner />}

        {error && (
          <EmptyState
            icon="❌"
            title="Error al cargar plantilla"
            description="No pudimos obtener la lista de jugadores de la API"
          />
        )}

        {players && players.length === 0 && !loading && !error && (
          <EmptyState
            icon="👥"
            title="Sin jugadores inscritos"
            description="Este club aún no ha registrado atletas en su plantilla oficial"
          />
        )}

        {players && players.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((player, index) => (
              <PlayerCard key={player.id} player={player} delay={index * 0.05} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
