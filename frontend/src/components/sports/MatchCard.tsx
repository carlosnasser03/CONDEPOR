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
  const hasScorers = homeScorers.length > 0 || awayScorers.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div
        role="article"
        aria-label={`Partido entre ${match.homeTeam?.name || 'Local'} y ${match.awayTeam?.name || 'Visitante'}: ${isFinished ? `Finalizado ${match.homeGoals ?? 0} a ${match.awayGoals ?? 0}` : isLive ? `En juego ${match.homeGoals ?? 0} a ${match.awayGoals ?? 0}` : 'Próximo partido'}`}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#111827] to-[#0b111e] border-2 ${
          isFinished ? 'border-slate-800 hover:border-emerald-500/60 shadow-xl' : isLive ? 'border-red-500/80 shadow-red-950/40 animate-pulse' : 'border-slate-800 hover:border-amber-400/60 shadow-xl'
        } transition-all duration-300`}
      >
        
        {/* Barra superior estilo MARCA LaLiga */}
        <div className="flex flex-wrap justify-between items-center px-6 py-3 bg-[#080d1a] border-b border-slate-800/80 text-xs font-bold text-slate-400 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-amber-400 font-extrabold flex items-center gap-1">
              🏆 PRIMERA DIVISIÓN
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-300">
              🏟️ {match.venue}
            </span>
          </div>
          <div>
            {isFinished ? (
              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 px-3 py-0.5 rounded-full font-black text-[11px] tracking-wider uppercase shadow-sm">
                ✓ Finalizado
              </span>
            ) : isLive ? (
              <span className="bg-red-950/90 text-red-400 border border-red-500/80 px-3 py-0.5 rounded-full font-black text-[11px] tracking-wider uppercase animate-pulse shadow-sm">
                🔴 En Vivo
              </span>
            ) : (
              <span className="bg-[#162038] text-amber-300 border border-amber-400/40 px-3 py-0.5 rounded-full font-bold text-[11px] tracking-wide shadow-sm flex items-center gap-1">
                📅 {formatDate(match.date)} &bull; {formatTime(match.date)}
              </span>
            )}
          </div>
        </div>

        {/* Fila principal del Marcador de Batalla (Scoreboard Centralizado y Simétrico) */}
        <div className="px-4 sm:px-8 py-7 flex items-center justify-center">
          <div className="w-full max-w-4xl flex items-center justify-between gap-2 sm:gap-6">
            
            {/* Equipo Local (Alineado a la derecha hacia el centro) */}
            <div className="flex items-center justify-end gap-3 flex-1 min-w-0">
              <div className="text-right min-w-0">
                <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug truncate">
                  {match.homeTeam?.name || 'Local'}
                </h3>
                <span className="inline-block text-[10px] font-black text-amber-400 tracking-widest uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 mt-1">
                  Local
                </span>
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

            {/* Pastilla Central del Marcador (Global Score centralizado) */}
            <div className="flex flex-col items-center justify-center shrink-0 w-32 sm:w-40 mx-1">
              <div className={`w-full bg-[#080d1a] border-2 ${
                isFinished ? 'border-emerald-500/80 shadow-emerald-500/10' : isLive ? 'border-red-500 shadow-red-500/20' : 'border-amber-400/80 shadow-amber-500/10'
              } px-3 py-2 rounded-2xl shadow-lg flex items-center justify-center gap-3`}>
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
                  <span className="text-lg sm:text-2xl font-black text-amber-400 tracking-widest uppercase">
                    VS
                  </span>
                )}
              </div>
              {isFinished && (
                <span className="text-[10px] font-black text-emerald-400 mt-1.5 tracking-widest uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Resultado Oficial
                </span>
              )}
            </div>

            {/* Equipo Visitante (Alineado a la izquierda hacia el centro) */}
            <div className="flex items-center justify-start gap-3 flex-1 min-w-0">
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
              <div className="text-left min-w-0">
                <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug truncate">
                  {match.awayTeam?.name || 'Visitante'}
                </h3>
                <span className="inline-block text-[10px] font-black text-sky-400 tracking-widest uppercase bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30 mt-1">
                  Visitante
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Franja Inferior Inteligente de Goleadores y Acta Arbitral */}
        {(isFinished || isLive) && (
          <div className="bg-[#080d1a] border-t border-slate-800/80 px-6 py-3 text-xs text-slate-300">
            {hasScorers ? (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-amber-400 font-black flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    ⚽ Goles Local:
                  </span>
                  {homeScorers.length > 0 ? (
                    homeScorers.map((s: any, idx: number) => (
                      <span key={idx} className="bg-[#162038] px-3 py-1 rounded-lg border border-amber-500/40 text-white font-extrabold shadow-sm">
                        {s.player?.name || 'Jugador'} <span className="text-amber-400">({s.goals}g)</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic font-semibold">Sin goles registrados</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-1 sm:mt-0">
                  <span className="text-sky-400 font-black flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    ⚽ Goles Visitante:
                  </span>
                  {awayScorers.length > 0 ? (
                    awayScorers.map((s: any, idx: number) => (
                      <span key={idx} className="bg-[#162038] px-3 py-1 rounded-lg border border-sky-500/40 text-white font-extrabold shadow-sm">
                        {s.player?.name || 'Jugador'} <span className="text-sky-400">({s.goals}g)</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic font-semibold">Sin goles registrados</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center text-center gap-2 py-0.5 text-slate-400 font-semibold text-xs">
                <span>📋 Acta oficial validada por mesa arbitral CONDEPOR</span>
              </div>
            )}
          </div>
        )}

      </div>
    </motion.div>
  );
};
