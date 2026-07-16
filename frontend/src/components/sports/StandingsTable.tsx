import React, { useState } from 'react';
import { Standing } from '@/types';
import Link from 'next/link';

interface StandingsTableProps {
  standings: Standing[];
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ standings }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const getPositionStyle = (position: number) => {
    if (position === 1) {
      return {
        textClass: 'text-amber-400 font-black text-lg sm:text-xl drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]',
        border: 'border-l-[5px] border-l-amber-500',
        label: 'Campeón / UCL',
      };
    }
    if (position <= 4) {
      return {
        textClass: 'text-sky-400 font-black text-base sm:text-lg',
        border: 'border-l-[5px] border-l-sky-500',
        label: 'Zona Champions',
      };
    }
    if (position <= 6) {
      return {
        textClass: 'text-emerald-400 font-black text-base sm:text-lg',
        border: 'border-l-[5px] border-l-emerald-500',
        label: 'Zona Europa',
      };
    }
    return {
      textClass: 'text-slate-300 font-extrabold text-base sm:text-lg',
      border: 'border-l-[5px] border-l-transparent',
      label: '',
    };
  };

  return (
    <div className="bg-[#0b111e] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden transition-all duration-300 text-slate-100" role="region" aria-label="Tabla de clasificación oficial">
      
      {/* Cabecera superior MARCA LaLiga Style */}
      <div className="bg-[#0f172a] text-white px-6 py-4 flex flex-wrap items-center justify-between border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 text-2xl">📊</span>
          <div>
            <h3 className="font-black text-base sm:text-lg tracking-tight uppercase text-white">
              Clasificación Oficial • Primera División
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              Actualización en tiempo real conforme a actas arbitrales
            </p>
          </div>
        </div>

        {/* Leyenda rápida de cualificación */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm shadow-amber-500/50" />
            Campeón / UCL
          </span>
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block shadow-sm shadow-sky-500/50" />
            Champions
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />
            Europa
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-describedby="standings-description">
          <thead>
            <tr className="bg-[#080d1a] border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-wider">
              <th scope="col" className="py-3.5 pl-5 pr-3 w-12 text-center">POS</th>
              <th scope="col" className="py-3.5 px-4 min-w-[200px]">EQUIPO</th>
              <th scope="col" className="py-3.5 px-3 text-center" title="Partidos Jugados">PJ</th>
              <th scope="col" className="py-3.5 px-3 text-center text-emerald-400" title="Partidos Ganados">G</th>
              <th scope="col" className="py-3.5 px-3 text-center text-amber-300" title="Partidos Empatados">E</th>
              <th scope="col" className="py-3.5 px-3 text-center text-red-400" title="Partidos Perdidos">P</th>
              <th scope="col" className="py-3.5 px-3 text-center hidden md:table-cell" title="Goles a Favor">GF</th>
              <th scope="col" className="py-3.5 px-3 text-center hidden md:table-cell" title="Goles en Contra">GC</th>
              <th scope="col" className="py-3.5 px-3 text-center" title="Diferencia de Goles">DIF</th>
              <th scope="col" className="py-3.5 pl-3 pr-6 text-right text-amber-400" title="Puntos Totales">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-medium text-sm">
            {standings.map((team) => {
              const style = getPositionStyle(team.position);
              const crestFallback = team.teamName ? team.teamName.substring(0, 3).toUpperCase() : 'EQU';

              return (
                <tr
                  key={team.teamId}
                  role="row"
                  className={`hover:bg-[#162033] transition-colors duration-150 bg-[#0b111e] ${style.border}`}
                >
                  {/* Posición (Sin encuadre interno, tipografía limpia y nítida) */}
                  <td className="py-3.5 pl-5 pr-3 text-center">
                    <span className={`inline-block ${style.textClass}`}>
                      {team.position}
                    </span>
                  </td>

                  {/* Escudo y Nombre (Estrictamente fijado a 32px x 32px con inline styles) */}
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/teams/${team.teamId}`}
                      className="flex items-center gap-3.5 group"
                      aria-label={`Ver jugadores de ${team.teamName}`}
                    >
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center overflow-hidden" style={{ width: '32px', height: '32px', minWidth: '32px', maxWidth: '32px', minHeight: '32px', maxHeight: '32px' }}>
                        {team.teamCrest && !imageErrors[team.teamId] ? (
                          <img
                            src={team.teamCrest || undefined}
                            alt={team.teamName}
                            width={32}
                            height={32}
                            style={{ width: '32px', height: '32px', minWidth: '32px', maxWidth: '32px', minHeight: '32px', maxHeight: '32px', objectFit: 'contain' }}
                            onError={() => setImageErrors((prev) => ({ ...prev, [team.teamId]: true }))}
                            className="drop-shadow-md group-hover:scale-110 transition-transform shrink-0 block"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 border border-slate-700" style={{ width: '32px', height: '32px', minWidth: '32px', maxWidth: '32px', minHeight: '32px', maxHeight: '32px' }}>
                            {crestFallback}
                          </div>
                        )}
                      </div>
                      <span className="font-extrabold text-white group-hover:text-amber-400 transition-colors text-sm sm:text-base tracking-tight truncate">
                        {team.teamName}
                      </span>
                    </Link>
                  </td>

                  {/* Partidos jugados */}
                  <td className="py-3.5 px-3 text-center font-extrabold text-slate-200">
                    {team.played}
                  </td>

                  {/* Ganados */}
                  <td className="py-3.5 px-3 text-center text-emerald-400 font-extrabold">
                    {team.wins}
                  </td>

                  {/* Empatados */}
                  <td className="py-3.5 px-3 text-center text-amber-300 font-extrabold">
                    {team.draws}
                  </td>

                  {/* Perdidos */}
                  <td className="py-3.5 px-3 text-center text-red-400 font-extrabold">
                    {team.losses}
                  </td>

                  {/* Goles a favor */}
                  <td className="py-3.5 px-3 text-center text-slate-400 font-bold hidden md:table-cell">
                    {team.goalsFor}
                  </td>

                  {/* Goles en contra */}
                  <td className="py-3.5 px-3 text-center text-slate-400 font-bold hidden md:table-cell">
                    {team.goalsAgainst}
                  </td>

                  {/* Diferencia (Sin encuadres internos según solicitud) */}
                  <td className={`py-3.5 px-3 text-center font-black text-sm ${
                    team.goalDifference > 0
                      ? 'text-emerald-400'
                      : team.goalDifference < 0
                      ? 'text-red-400'
                      : 'text-slate-400'
                  }`}>
                    {team.goalDifference > 0 ? '+' : ''}
                    {team.goalDifference}
                  </td>

                  {/* Puntos totales (Sin encuadres internos, tipografía limpia MARCA) */}
                  <td className="py-3.5 pl-3 pr-6 text-right font-black text-base sm:text-lg text-amber-400 tracking-tight">
                    {team.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p id="standings-description" className="sr-only">
          Tabla de posiciones ordenada por puntos en orden descendente.
          Puedes hacer clic en los nombres de los equipos para ver los jugadores.
        </p>
      </div>

      {/* Pie de tabla explicativo */}
      <div className="bg-[#0f172a] border-t border-slate-800 px-6 py-3.5 text-xs text-slate-400 flex flex-wrap justify-between items-center gap-2">
        <div>
          <span className="font-bold text-amber-400">Nota:</span> Los puntos se calculan automáticamente tras cada partido finalizado y validado en el acta.
        </div>
        <div className="flex gap-4 font-semibold text-slate-300">
          <span><strong className="text-white">PJ:</strong> Partidos Jugados</span>
          <span><strong className="text-amber-400">PTS:</strong> Puntos Totales</span>
        </div>
      </div>

    </div>
  );
};
