import React from 'react';
import { Match } from '@/types';
import { motion } from 'framer-motion';
import { formatDate, formatTime } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
  delay?: number;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, delay = 0 }) => {
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'in_progress';

  const homeCrest = match.homeTeam?.name ? match.homeTeam.name.substring(0, 3).toUpperCase() : 'LOC';
  const awayCrest = match.awayTeam?.name ? match.awayTeam.name.substring(0, 3).toUpperCase() : 'VIS';

  // Extraer goleadores si vienen en playerStats
  const homeScorers = (match.playerStats || []).filter((s: any) => s.goals > 0 && s.player?.teamId === match.homeTeamId);
  const awayScorers = (match.playerStats || []).filter((s: any) => s.goals > 0 && s.player?.teamId === match.awayTeamId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div
        role="article"
        aria-label={`Partido entre ${match.homeTeam?.name || 'Local'} y ${match.awayTeam?.name || 'Visitante'}: ${isFinished ? `Finalizado ${match.homeGoals ?? 0} a ${match.awayGoals ?? 0}` : isLive ? `En juego ${match.homeGoals ?? 0} a ${match.awayGoals ?? 0}` : 'Próximo partido'}`}
        className={`relative overflow-hidden rounded-2xl bg-[#0b111e] border ${
          isFinished ? 'border-emerald-500/40 shadow-emerald-950/20' : isLive ? 'border-red-500/50 shadow-red-950/30' : 'border-amber-500/40 shadow-amber-950/20'
        } shadow-2xl transition-all duration-300 hover:shadow-3xl`}
      >
        
        {/* Barra superior estilo MARCA */}
        <div className="flex justify-between items-center px-5 py-2.5 bg-black/40 border-b border-white/10 text-xs font-bold text-slate-400 tracking-wide">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400">🏆 PRIMERA DIVISIÓN</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">🏟️ {match.venue}</span>
          </div>
          <div>
            {isFinished ? (
              <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-extrabold text-[11px] tracking-wider uppercase">
                Finalizado
              </span>
            ) : isLive ? (
              <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-2.5 py-0.5 rounded-full font-extrabold text-[11px] tracking-wider uppercase animate-pulse">
                🔴 En Vivo
              </span>
            ) : (
              <span className="text-sky-400 font-semibold">
                📅 {formatDate(match.date)} - {formatTime(match.date)}
              </span>
            )}
          </div>
        </div>

        {/* Fila principal del Marcador estilo MARCA */}
        <div className="flex items-center justify-between px-6 py-6 gap-4 sm:gap-6 flex-wrap sm:flex-nowrap">
          
          {/* Equipo Local */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 flex-1 min-w-[140px]">
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                {match.homeTeam?.name || 'Local'}
              </h3>
              <p className="text-[10px] font-extrabold text-amber-400 tracking-widest uppercase mt-0.5">
                Local
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ width: '38px', height: '38px', minWidth: '38px', maxWidth: '38px', minHeight: '38px', maxHeight: '38px' }}>
              {match.homeTeam?.crestUrl ? (
                <img
                  src={match.homeTeam.crestUrl}
                  alt={match.homeTeam.name}
                  width={38}
                  height={38}
                  style={{ width: '38px', height: '38px', minWidth: '38px', maxWidth: '38px', minHeight: '38px', maxHeight: '38px', objectFit: 'contain' }}
                  className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] flex-shrink-0 block"
                />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-amber-400 text-sm flex-shrink-0 border border-slate-700" style={{ width: '38px', height: '38px', minWidth: '38px', maxWidth: '38px', minHeight: '38px', maxHeight: '38px' }}>
                  {homeCrest}
                </div>
              )}
            </div>
          </div>

          {/* Pastilla Central del Marcador (Global Score) */}
          <div className="flex flex-col items-center justify-center mx-1 my-2 sm:my-0">
            <div className={`bg-slate-900 border-2 ${
              isFinished ? 'border-emerald-500' : isLive ? 'border-red-500' : 'border-sky-400'
            } px-4 sm:px-6 py-1.5 rounded-xl shadow-[inset_0_2px_6px_rgba(0,0,0,0.8),0_6px_16px_rgba(0,0,0,0.6)] flex items-center justify-center gap-2.5 min-w-[115px]`}>
              {isFinished || isLive ? (
                <>
                  <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-wider">
                    {match.homeGoals ?? 0}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-slate-500">-</span>
                  <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-wider">
                    {match.awayGoals ?? 0}
                  </span>
                </>
              ) : (
                <span className="text-lg sm:text-xl font-black text-sky-400 tracking-wider uppercase">
                  VS
                </span>
              )}
            </div>
            {isFinished && (
              <span className="text-[9px] font-extrabold text-emerald-400 mt-1 tracking-widest uppercase">
                Resultado Oficial
              </span>
            )}
          </div>

          {/* Equipo Visitante */}
          <div className="flex items-center justify-start gap-2.5 sm:gap-3 flex-1 min-w-[140px]">
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ width: '38px', height: '38px', minWidth: '38px', maxWidth: '38px', minHeight: '38px', maxHeight: '38px' }}>
              {match.awayTeam?.crestUrl ? (
                <img
                  src={match.awayTeam.crestUrl}
                  alt={match.awayTeam.name}
                  width={38}
                  height={38}
                  style={{ width: '38px', height: '38px', minWidth: '38px', maxWidth: '38px', minHeight: '38px', maxHeight: '38px', objectFit: 'contain' }}
                  className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] flex-shrink-0 block"
                />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-sky-400 text-sm flex-shrink-0 border border-slate-700" style={{ width: '38px', height: '38px', minWidth: '38px', maxWidth: '38px', minHeight: '38px', maxHeight: '38px' }}>
                  {awayCrest}
                </div>
              )}
            </div>
            <div className="text-left">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                {match.awayTeam?.name || 'Visitante'}
              </h3>
              <p className="text-[10px] font-extrabold text-sky-400 tracking-widest uppercase mt-0.5">
                Visitante
              </p>
            </div>
          </div>

        </div>

        {/* Franja Inferior de Goleadores (Estilo MARCA) */}
        {(isFinished || isLive) && (
          <div className="bg-black/60 border-t border-white/10 px-6 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-amber-400 font-extrabold flex items-center gap-1">
                ⚽ Goles Local:
              </span>
              {homeScorers.length > 0 ? (
                homeScorers.map((s: any, idx: number) => (
                  <span key={idx} className="bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700 text-white font-semibold">
                    {s.player?.name || 'Jugador'} ({s.goals})
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic">Ninguno</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1 sm:mt-0">
              <span className="text-sky-400 font-extrabold flex items-center gap-1">
                ⚽ Goles Visitante:
              </span>
              {awayScorers.length > 0 ? (
                awayScorers.map((s: any, idx: number) => (
                  <span key={idx} className="bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700 text-white font-semibold">
                    {s.player?.name || 'Jugador'} ({s.goals})
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic">Ninguno</span>
              )}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};
