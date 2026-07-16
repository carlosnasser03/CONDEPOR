'use client';

import { useState } from 'react';
import { useTeamPlayers } from '@/lib/hooks';
import { PlayerCard, getTacticalData } from '@/components/sports/PlayerCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface PageProps {
  params: {
    teamId: string;
  };
}

export default function TeamPlayersPage({ params }: PageProps) {
  const { data: players, loading, error } = useTeamPlayers(params.teamId);
  const [activeZone, setActiveZone] = useState<string>('all');

  // Filtrar jugadores por zona táctica seleccionada (admite códigos DFC/MC/DC y palabras genéricas)
  const filteredPlayers = players ? players.filter(player => {
    if (activeZone === 'all') return true;
    const tactical = getTacticalData(player.position);
    const pStr = (player.position || '').toLowerCase();
    if (activeZone === 'por') return tactical.code === 'POR' || pStr.includes('por');
    if (activeZone === 'def') return ['DFC', 'LD', 'LI'].includes(tactical.code) || pStr.includes('def');
    if (activeZone === 'med') return ['MCD', 'MC', 'MCO'].includes(tactical.code) || pStr.includes('med') || pStr === 'mc';
    if (activeZone === 'del') return ['DC', 'ED', 'EI'].includes(tactical.code) || pStr.includes('del') || pStr.includes('ext');
    return true;
  }) : [];

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Enlace de Regreso MARCA con Animación Burbuja */}
        <div className="mb-8">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.04, x: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827] hover:bg-[#1f2937] border border-slate-800 text-amber-400 font-bold text-sm tracking-wide transition-colors duration-200 shadow-md hover:border-amber-500/50 cursor-pointer select-none"
            >
              <span>&larr;</span>
              <span>Volver al Inicio y Ligas</span>
            </motion.div>
          </Link>
        </div>

        {/* Hero Header de Plantilla y Guía Táctica */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101828] via-[#0f172a] to-[#090e17] border border-amber-500/30 p-6 sm:p-10 mb-8 shadow-2xl"
        >
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
                Haz clic en cualquier ficha de atleta para abrir su <strong className="text-amber-400">Modal de Demarcación y Funciones Tácticas</strong> en forma de burbuja (sin alterar la cuadrícula de jugadores).
              </p>
            </div>

            {players && players.length > 0 && (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-[#080d1a]/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 text-center shrink-0 min-w-[140px] shadow-lg"
              >
                <div className="text-3xl sm:text-4xl font-black text-amber-400">
                  {players.length}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Atletas Inscritos
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Selector de Filtros por Líneas / Zonas Tácticas con Efecto Burbuja */}
        {players && players.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-2 bg-[#111827]/90 border border-slate-800/80 rounded-2xl mb-8 shadow-inner">
            {[
              { id: 'all', label: `🌐 Todos (${players.length})`, activeColor: 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/25' },
              { id: 'por', label: '🛡️ Porteros (POR #1)', activeColor: 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/25' },
              { id: 'def', label: '🧱 Defensas (DFC, LD, LI)', activeColor: 'bg-gradient-to-r from-sky-500 to-sky-400 text-slate-950 font-black shadow-lg shadow-sky-500/25' },
              { id: 'med', label: '🎯 Mediocampistas (MCD, MC, MCO)', activeColor: 'bg-gradient-to-r from-purple-500 to-purple-400 text-white font-black shadow-lg shadow-purple-500/25' },
              { id: 'del', label: '⚡ Delanteros (DC, ED, EI)', activeColor: 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/25' }
            ].map((tab) => {
              const isActive = activeZone === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveZone(tab.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  className={`px-4 py-2.5 rounded-xl text-sm transition-colors duration-200 cursor-pointer select-none ${
                    isActive
                      ? tab.activeColor
                      : 'bg-transparent text-slate-400 font-bold hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </motion.button>
              );
            })}
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

        {/* Grilla de Atletas MARCA con Animación Burbuja de Salida/Entrada */}
        {filteredPlayers.length > 0 && (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredPlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                >
                  <PlayerCard player={player} delay={index * 0.03} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
}
