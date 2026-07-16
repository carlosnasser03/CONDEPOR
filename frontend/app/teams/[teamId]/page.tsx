'use client';

import { useState } from 'react';
import { useTeamPlayers } from '@/lib/hooks';
import { PlayerCard, getTacticalData } from '@/components/sports/PlayerCard';
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
  const [activeZone, setActiveZone] = useState<string>('all');

  // Filtrar jugadores por zona táctica seleccionada
  const filteredPlayers = players ? players.filter(player => {
    if (activeZone === 'all') return true;
    const tactical = getTacticalData(player.position);
    if (activeZone === 'por') return tactical.code === 'POR';
    if (activeZone === 'def') return ['DFC', 'LD', 'LI'].includes(tactical.code);
    if (activeZone === 'med') return ['MCD', 'MC', 'MCO'].includes(tactical.code);
    if (activeZone === 'del') return ['DC', 'ED', 'EI'].includes(tactical.code);
    return true;
  }) : [];

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Enlace de Regreso MARCA */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827] hover:bg-[#1f2937] border border-slate-800 text-amber-400 font-bold text-sm tracking-wide transition-all duration-200 shadow-sm hover:border-amber-500/50"
          >
            <span>&larr;</span>
            <span>Volver al Inicio y Ligas</span>
          </Link>
        </div>

        {/* Hero Header de Plantilla y Guía Táctica */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101828] via-[#0f172a] to-[#090e17] border border-amber-500/30 p-6 sm:p-10 mb-8 shadow-2xl">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Plantilla Oficial & Demarcaciones Tácticas</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none mb-3">
                Plantilla y Jugadores
              </h1>
              <p className="text-slate-400 text-sm sm:text-base font-medium max-w-3xl">
                Haz clic en cualquier ficha de atleta para abrir su <strong className="text-amber-400">Modal de Demarcación y Funciones Tácticas</strong> en el terreno de juego (según la guía técnica de posiciones: Portero, Zaga, Medular y Ataque).
              </p>
            </div>

            {players && players.length > 0 && (
              <div className="bg-[#080d1a]/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 text-center shrink-0 min-w-[140px] shadow-lg">
                <div className="text-3xl sm:text-4xl font-black text-amber-400">
                  {players.length}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Atletas Inscritos
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selector de Filtros por Líneas / Zonas Tácticas */}
        {players && players.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5 p-2 bg-[#111827] border border-slate-800 rounded-2xl mb-8">
            <button
              onClick={() => setActiveZone('all')}
              className={`px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-200 ${
                activeZone === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              🌐 Todos ({players.length})
            </button>
            <button
              onClick={() => setActiveZone('por')}
              className={`px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-200 flex items-center gap-2 ${
                activeZone === 'por'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-transparent text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60'
              }`}
            >
              <span>🛡️</span>
              <span>Porteros (POR #1)</span>
            </button>
            <button
              onClick={() => setActiveZone('def')}
              className={`px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-200 flex items-center gap-2 ${
                activeZone === 'def'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'bg-transparent text-slate-400 hover:text-sky-300 hover:bg-slate-800/60'
              }`}
            >
              <span>🧱</span>
              <span>Defensas (DFC, LD, LI)</span>
            </button>
            <button
              onClick={() => setActiveZone('med')}
              className={`px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-200 flex items-center gap-2 ${
                activeZone === 'med'
                  ? 'bg-purple-500 text-slate-950 shadow-md'
                  : 'bg-transparent text-slate-400 hover:text-purple-300 hover:bg-slate-800/60'
              }`}
            >
              <span>🎯</span>
              <span>Mediocampistas (MCD, MC, MCO)</span>
            </button>
            <button
              onClick={() => setActiveZone('del')}
              className={`px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-200 flex items-center gap-2 ${
                activeZone === 'del'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-transparent text-slate-400 hover:text-amber-300 hover:bg-slate-800/60'
              }`}
            >
              <span>⚡</span>
              <span>Delanteros (DC, ED, EI)</span>
            </button>
          </div>
        )}

        {/* Estados de Carga y Error */}
        {loading && (
          <div className="py-20 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="py-12">
            <EmptyState
              icon="❌"
              title="Error al cargar plantilla"
              description="No pudimos obtener la lista oficial de jugadores del club en este momento."
            />
          </div>
        )}

        {players && players.length === 0 && !loading && !error && (
          <div className="py-12">
            <EmptyState
              icon="👥"
              title="Sin jugadores inscritos"
              description="Este club aún no ha registrado atletas ni fichas en su plantilla oficial para esta categoría."
            />
          </div>
        )}

        {filteredPlayers.length === 0 && players && players.length > 0 && (
          <div className="py-12">
            <EmptyState
              icon="⚽"
              title="Sin atletas en esta demarcación"
              description="No hay jugadores inscritos que correspondan a la zona táctica seleccionada."
            />
          </div>
        )}

        {/* Grilla de Atletas MARCA */}
        {filteredPlayers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player, index) => (
              <PlayerCard key={player.id} player={player} delay={index * 0.04} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
