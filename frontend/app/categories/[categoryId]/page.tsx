'use client';

import { useState } from 'react';
import { useStandings, useScorers, useCategoryMatches } from '@/lib/hooks';
import { StandingsTable } from '@/components/sports/StandingsTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { MatchCard } from '@/components/sports/MatchCard';
import { Trophy, Calendar, Award, ShieldAlert, ChevronLeft, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PageProps {
  params: {
    categoryId: string;
  };
}

export default function CategoryPage({ params }: PageProps) {
  const categoryId = params.categoryId;
  const { data: standings, loading: standingsLoading } = useStandings(categoryId);
  const { data: matches, loading: matchesLoading } = useCategoryMatches(categoryId);
  const { data: scorers, loading: scorersLoading } = useScorers(categoryId, 10);

  const [activeTab, setActiveTab] = useState('standings');

  // Cálculo de estadísticas rápidas para el banner MARCA
  const totalTeams = standings?.length || 0;
  const finishedMatches = matches?.filter(m => m.status === 'finished').length || 0;
  const totalGoals = standings?.reduce((acc, t) => acc + (t.goalsFor || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-slate-950">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Botón Volver estilo Broadcast */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-amber-400 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Volver al Inicio • Todas las Categorías
          </Link>
        </div>

        {/* Hero Banner Estilo MARCA / Primera División */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101828] via-[#0f172a] to-[#090e17] border border-amber-500/30 p-6 sm:p-10 mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
        >
          {/* Efecto de brillo de fondo */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 font-black text-[11px] tracking-widest uppercase mb-4">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                CENTRO OFICIAL DE COMPETICIÓN • LIGA ESPAÑOLA STYLE
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-md">
                Torneo y Clasificación
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
                Revisa la <span className="text-amber-400 font-bold">Tabla de Posiciones Oficial</span> en tiempo real, calendario de partidos con marcadores e insignias proporcionadas y la lucha por el trofeo <span className="text-sky-400 font-bold">Pichichi al Máximo Goleador</span>.
              </p>
            </div>

            {/* Tarjetas rápidas de estadísticas (Mini-Dashboard MARCA) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 flex-shrink-0">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center min-w-[95px] sm:min-w-[120px] backdrop-blur-sm">
                <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Equipos</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{totalTeams}</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center min-w-[95px] sm:min-w-[120px] backdrop-blur-sm">
                <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Partidos</span>
                <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">{finishedMatches}</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center min-w-[95px] sm:min-w-[120px] backdrop-blur-sm">
                <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Goles</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{totalGoals}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Selector de Pestañas Estilo Pastilla Broadcast (Pill Tabs) */}
        <div className="flex items-center gap-2 p-1.5 bg-[#111827] border border-slate-800/90 rounded-2xl mb-8 flex-wrap max-w-fit shadow-xl">
          <button
            onClick={() => setActiveTab('standings')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-200 uppercase tracking-wider ${
              activeTab === 'standings'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4" />
            📊 Clasificación Oficial
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-200 uppercase tracking-wider ${
              activeTab === 'matches'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            📅 Jornada y Marcadores
          </button>

          <button
            onClick={() => setActiveTab('scorers')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-200 uppercase tracking-wider ${
              activeTab === 'scorers'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-4 h-4" />
            ⚽ Trofeo Pichichi (Goleadores)
          </button>
        </div>

        {/* TAB CONTENT 1: TABLA DE POSICIONES MARCA */}
        {activeTab === 'standings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {standingsLoading && <LoadingSpinner />}
            {standings && standings.length === 0 && !standingsLoading && (
              <EmptyState
                icon="📊"
                title="Sin datos en tabla de posiciones"
                description="Aún no hay equipos asignados o partidos registrados en esta categoría"
              />
            )}
            {standings && standings.length > 0 && <StandingsTable standings={standings} />}
          </motion.div>
        )}

        {/* TAB CONTENT 2: PARTIDOS Y MARCADORES PROPORCIONADOS */}
        {activeTab === 'matches' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {matchesLoading && <LoadingSpinner />}
            {matches && matches.length === 0 && !matchesLoading && (
              <EmptyState
                icon="⚽"
                title="Sin partidos programados"
                description="No hay encuentros programados o disputados en esta categoría todavía"
              />
            )}
            {matches && matches.length > 0 && (
              <div className="grid gap-5">
                {matches.map((match, index) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    delay={index * 0.05}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB CONTENT 3: GOLEADORES / PICHICHI STYLE */}
        {activeTab === 'scorers' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {scorersLoading && <LoadingSpinner />}
            {scorers && scorers.length === 0 && !scorersLoading && (
              <EmptyState
                icon="🏆"
                title="Sin goles registrados aún"
                description="Cuando se registren las actas oficiales con anotadores, la tabla por el Trofeo Pichichi se generará aquí."
              />
            )}
            {scorers && scorers.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {scorers.map((scorer, idx) => {
                  const isTop1 = idx === 0;
                  const isTop3 = idx < 3;
                  return (
                    <div
                      key={scorer.playerId || idx}
                      className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 flex items-center gap-4 ${
                        isTop1
                          ? 'bg-gradient-to-br from-amber-950/60 to-slate-900 border-amber-500/80 shadow-[0_10px_25px_rgba(245,158,11,0.2)]'
                          : isTop3
                          ? 'bg-slate-900/90 border-amber-500/40 shadow-lg'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Medalla de posición */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner ${
                        isTop1
                          ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-amber-400/50'
                          : isTop3
                          ? 'bg-slate-800 border border-amber-500/50 text-amber-400'
                          : 'bg-slate-800/80 text-slate-400 border border-slate-700'
                      }`}>
                        #{idx + 1}
                      </div>

                      {/* Info del jugador */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-white text-base truncate">
                            {scorer.playerName}
                          </h4>
                          {isTop1 && <span className="text-amber-400 text-xs">👑</span>}
                        </div>
                        <p className="text-xs font-bold text-amber-400/90 truncate mt-0.5 flex items-center gap-1.5">
                          {scorer.teamCrest && (
                            <img src={scorer.teamCrest} alt="" width={16} height={16} style={{ width: '16px', height: '16px', minWidth: '16px', maxWidth: '16px', minHeight: '16px', maxHeight: '16px', objectFit: 'contain' }} className="inline-block flex-shrink-0" />
                          )}
                          {scorer.teamName}
                        </p>
                      </div>

                      {/* Total de Goles */}
                      <div className="text-right flex-shrink-0 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
                        <div className="text-2xl font-mono font-black text-white leading-none">
                          {scorer.goals || 0}
                        </div>
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">goles</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
