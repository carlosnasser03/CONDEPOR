'use client';

import React, { useState } from 'react';
import { Player } from '@/types';
import { motion } from 'framer-motion';

interface PlayerCardProps {
  player: Player;
  delay?: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, delay = 0 }) => {
  const [imgError, setImgError] = useState(false);

  // Obtener iniciales para el avatar cuando no hay foto o falla la carga
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('');
  };

  // Color de etiqueta según posición
  const getPositionStyle = (pos: string) => {
    const p = pos.toLowerCase();
    if (p.includes('portero')) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (p.includes('defensa')) return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
    if (p.includes('medio')) return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    if (p.includes('delantero')) return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
  };

  const hasValidPhoto = player.photoUrl && player.photoUrl.trim() !== '' && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="h-full"
    >
      <div className="h-full bg-[#0f172a]/95 hover:bg-[#162038] border border-slate-800/85 hover:border-amber-500/50 rounded-2xl p-5 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden">
        
        {/* Resplandor sutil MARCA en hover */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div>
          {/* Zona Superior: Foto o Avatar del Jugador */}
          <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 border border-slate-800/80 bg-gradient-to-b from-[#1e293b]/60 to-[#0b111e]">
            {hasValidPhoto ? (
              <img
                src={player.photoUrl}
                alt={player.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
                {/* Dorsal de Fondo en Gran Formato */}
                <span className="absolute text-7xl font-black text-slate-800/35 select-none tracking-tighter">
                  #{player.jerseyNumber || '0'}
                </span>
                
                {/* Círculo de Iniciales / Dorsal */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg border-2 border-slate-900 z-10 mb-2 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl font-black text-slate-950">
                    {getInitials(player.name) || `#${player.jerseyNumber || '0'}`}
                  </span>
                </div>

                <span className="text-xs font-bold text-slate-400 z-10 tracking-wider uppercase">
                  Dorsal #{player.jerseyNumber || '0'}
                </span>
              </div>
            )}

            {/* Etiqueta Flotante de Posición en esquina superior derecha */}
            <div className="absolute top-2.5 right-2.5 z-20">
              <span className={`text-xs font-black px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-sm ${getPositionStyle(player.position)}`}>
                {player.position}
              </span>
            </div>
          </div>

          {/* Nombre y Dorsal */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors duration-200 tracking-tight leading-snug">
              {player.name}
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Ficha Atleta &bull; #{player.jerseyNumber || 'Sin Dorsal'}
            </p>
          </div>
        </div>

        {/* Zona Inferior: Estadísticas MARCA (Goles / Puntos) */}
        <div className="grid grid-cols-2 gap-2.5 mt-auto pt-3 border-t border-slate-800/80">
          <div className="bg-[#080d1a]/85 border border-slate-800/90 rounded-xl p-2.5 text-center group-hover:border-amber-500/30 transition-colors">
            <div className="text-2xl font-black text-amber-400 tracking-tight">
              {player.seasonGoals || 0}
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Goles
            </div>
          </div>

          <div className="bg-[#080d1a]/85 border border-slate-800/90 rounded-xl p-2.5 text-center group-hover:border-sky-500/30 transition-colors">
            <div className="text-2xl font-black text-sky-400 tracking-tight">
              {player.seasonPoints !== undefined ? player.seasonPoints.toFixed(0) : 0}
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Puntos
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
