import React from 'react';
import { Standing } from '@/types';
import Link from 'next/link';

interface StandingsTableProps {
  standings: Standing[];
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ standings }) => {
  const getPositionStyle = (position: number) => {
    if (position === 1) {
      return {
        badge: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md border border-amber-300',
        border: 'border-l-[5px] border-l-amber-500',
        label: 'Campeón / UCL',
      };
    }
    if (position <= 4) {
      return {
        badge: 'bg-blue-600 text-white font-extrabold shadow-sm border border-blue-400/50',
        border: 'border-l-[5px] border-l-blue-500',
        label: 'Zona Champions',
      };
    }
    if (position <= 6) {
      return {
        badge: 'bg-emerald-600 text-white font-extrabold shadow-sm border border-emerald-400/50',
        border: 'border-l-[5px] border-l-emerald-500',
        label: 'Zona Europa',
      };
    }
    return {
      badge: 'bg-slate-800 text-slate-300 font-bold border border-slate-700',
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
              Ordenado por Puntos, Diferencia de Goles y Goles a Favor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-extrabold text-slate-300 hidden sm:flex">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span> 1° Campeón</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span> 2°-4° Champions</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span> 5°-6° Europa</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-describedby="standings-description">
          <thead>
            <tr className="bg-[#111827] border-b-2 border-slate-800 text-slate-300 text-[11px] sm:text-xs font-black uppercase tracking-wider">
              <th scope="col" className="py-4 pl-5 pr-3 w-14 text-center text-amber-400">POS</th>
              <th scope="col" className="py-4 px-4 min-w-[220px] text-white">EQUIPO</th>
              <th scope="col" className="py-4 px-3 text-center w-12 text-slate-200 font-black" title="Partidos Jugados">PJ</th>
              <th scope="col" className="py-4 px-3 text-center w-12 text-emerald-400 font-black" title="Partidos Ganados">G</th>
              <th scope="col" className="py-4 px-3 text-center w-12 text-amber-400 font-black" title="Partidos Empatados">E</th>
              <th scope="col" className="py-4 px-3 text-center w-12 text-red-400 font-black" title="Partidos Perdidos">P</th>
              <th scope="col" className="py-4 px-3 text-center w-12 text-slate-400 hidden md:table-cell" title="Goles a Favor">GF</th>
              <th scope="col" className="py-4 px-3 text-center w-12 text-slate-400 hidden md:table-cell" title="Goles en Contra">GC</th>
              <th scope="col" className="py-4 px-3 text-center w-16 text-slate-200 font-black" title="Diferencia de Goles">DIF</th>
              <th scope="col" className="py-4 pl-3 pr-6 text-right w-24 sm:w-28 text-amber-400 font-black">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-sm font-semibold">
            {standings.map((team) => {
              const style = getPositionStyle(team.position);
              const crestFallback = team.teamName ? team.teamName.substring(0, 3).toUpperCase() : 'EQU';

              return (
                <tr
                  key={team.teamId}
                  role="row"
                  className={`hover:bg-[#162033] transition-colors duration-150 bg-[#0b111e] ${style.border}`}
                >
                  {/* Posición con insignia de color */}
                  <td className="py-3.5 pl-5 pr-3 text-center">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${style.badge}`}>
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
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ width: '32px', height: '32px', minWidth: '32px', maxWidth: '32px', minHeight: '32px', maxHeight: '32px' }}>
                        {team.teamCrest ? (
                          <img
                            src={team.teamCrest}
                            alt={team.teamName}
                            width={32}
                            height={32}
                            style={{ width: '32px', height: '32px', minWidth: '32px', maxWidth: '32px', minHeight: '32px', maxHeight: '32px', objectFit: 'contain' }}
                            className="drop-shadow-md group-hover:scale-110 transition-transform flex-shrink-0 block"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center flex-shrink-0 border border-slate-700" style={{ width: '32px', height: '32px', minWidth: '32px', maxWidth: '32px', minHeight: '32px', maxHeight: '32px' }}>
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
