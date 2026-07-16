'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Player } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerCardProps {
  player: Player;
  delay?: number;
}

// Diccionario oficial de Nomenclatura, Funciones y Zonas Tácticas según guía oficial
const TACTICAL_INFO: Record<string, {
  code: string;
  name: string;
  zone: string;
  zoneColor: string;
  commonNumbers: string;
  description: string;
  functions: string[];
}> = {
  por: {
    code: 'POR',
    name: 'Portero / Guardameta',
    zone: 'Zona Defensiva (Área Propia)',
    zoneColor: 'from-emerald-900/60 to-emerald-950/80 border-emerald-500/40 text-emerald-300',
    commonNumbers: '#1',
    description: 'Última línea dentro del área propia. Único jugador autorizado para utilizar las manos dentro de su área para atrapar, despejar y proteger el arco.',
    functions: [
      'Evitar que el equipo rival convierta goles parando disparos y balones aéreos.',
      'Organizar la línea defensiva liderando la comunicación desde el fondo.',
      'Participar como un jugador de campo más en la salida limpia del balón con los pies.'
    ]
  },
  dfc: {
    code: 'DFC',
    name: 'Defensa Central',
    zone: 'Zona Defensiva (Zaga Central)',
    zoneColor: 'from-sky-900/60 to-sky-950/80 border-sky-500/40 text-sky-300',
    commonNumbers: '#4, #5',
    description: 'Pilar fundamental de la zaga. Se ubica en el centro de la defensa marcando directamente a los delanteros centro y bloqueando ataques rivales.',
    functions: [
      'Marcar al delantero centro rival y anticipar sus desmarques.',
      'Interceptar balones, despejar centros aéreos y bloquear disparos al arco.',
      'Dirigir el orden táctico de la defensa y mantener el fuera de juego.'
    ]
  },
  ld: {
    code: 'LD',
    name: 'Defensa Lateral Derecho',
    zone: 'Zona Defensiva / Banda Derecha',
    zoneColor: 'from-sky-900/60 to-sky-950/80 border-sky-500/40 text-sky-300',
    commonNumbers: '#2',
    description: 'Banda defensiva derecha. Encargado de neutralizar al extremo contrario y sumarse con gran potencia física a las transiciones ofensivas.',
    functions: [
      'Defender la banda derecha conteniendo el regate y velocidad de los extremos rivales.',
      'Incorporarse al ataque subiendo y bajando la banda con alto sacrificio físico.',
      'Enviar centros precisos al área para conectar con los delanteros.'
    ]
  },
  li: {
    code: 'LI',
    name: 'Defensa Lateral Izquierdo',
    zone: 'Zona Defensiva / Banda Izquierda',
    zoneColor: 'from-sky-900/60 to-sky-950/80 border-sky-500/40 text-sky-300',
    commonNumbers: '#3',
    description: 'Banda defensiva izquierda. Encargado de neutralizar al extremo contrario y sumarse al ataque por el carril izquierdo con centros al área.',
    functions: [
      'Defender la banda izquierda conteniendo los ataques del extremo contrario.',
      'Subir y bajar la banda con gran capacidad física apoyando las transiciones ofensivas.',
      'Asistir con centros y paredes desde la línea de fondo.'
    ]
  },
  mcd: {
    code: 'MCD',
    name: 'Mediocampista Defensivo / Contención',
    zone: 'Zona de Creación / Base Medular',
    zoneColor: 'from-purple-900/60 to-purple-950/80 border-purple-500/40 text-purple-300',
    commonNumbers: '#6',
    description: 'Ubicado justo delante de la línea defensiva. Es el escudo de contención del equipo y el primer distribuidor en la transición defensa-ataque.',
    functions: [
      'Recuperar balones, cortar líneas de pase y frenar contragolpes rivales.',
      'Apoyar a los defensas centrales facilitando la salida limpia del balón.',
      'Distribuir el juego con inteligencia táctica y excelente visión de campo.'
    ]
  },
  mc: {
    code: 'MC',
    name: 'Mediocampista Mixto / Todocampista',
    zone: 'Zona de Creación (Centro del Campo)',
    zoneColor: 'from-purple-900/60 to-purple-950/80 border-purple-500/40 text-purple-300',
    commonNumbers: '#8',
    description: 'El motor polivalente del equipo ("Box-to-Box"). Conecta permanentemente la defensa con el ataque gracias a una capacidad física y táctica superior.',
    functions: [
      'Equilibrar el equipo participando en la recuperación y en el despliegue ofensivo.',
      'Conectar las líneas defensivas con los atacantes mediante pases dinámicos.',
      'Llegar desde segunda línea al área rival para sorprender con remates.'
    ]
  },
  mco: {
    code: 'MCO',
    name: 'Mediocampista Ofensivo / Mediapunta',
    zone: 'Zona de Creación / Enganche',
    zoneColor: 'from-purple-900/60 to-purple-950/80 border-purple-500/40 text-purple-300',
    commonNumbers: '#10',
    description: 'El cerebro y estrella creativa del equipo. Se mueve detrás de los delanteros sirviendo como enganche decisivo en los últimos metros.',
    functions: [
      'Generar claras oportunidades de gol y filtrar pases clave (asistencias).',
      'Desequilibrar en tres cuartos de cancha con técnica refinada y regate.',
      'Tomar decisiones creativas y decisivas para romper defensas cerradas.'
    ]
  },
  dc: {
    code: 'DC',
    name: 'Delantero Centro / Ariete',
    zone: 'Zona Ofensiva (Frente al Arco)',
    zoneColor: 'from-amber-900/60 to-amber-950/80 border-amber-500/40 text-amber-300',
    commonNumbers: '#9',
    description: 'Pilar fundamental del ataque central. Vive en el área rival con la máxima presión y la misión prioritaria de convertir oportunidades en gol.',
    functions: [
      'Finalizar las jugadas convirtiendo en gol las ocasiones generadas por el equipo.',
      'Crear espacios en la defensa rival mediante desmarques y anticipación inteligente.',
      'Liderar el sacrificio defensivo iniciando la presión alta al portero y centrales.'
    ]
  },
  ed: {
    code: 'ED',
    name: 'Extremo Derecho',
    zone: 'Zona Ofensiva / Banda Derecha',
    zoneColor: 'from-amber-900/60 to-amber-950/80 border-amber-500/40 text-amber-300',
    commonNumbers: '#7',
    description: 'Atacante veloz por el carril derecho. Encargado de desbordar defensas laterales, regatear y asistir o definir entrando al área.',
    functions: [
      'Atacar por banda derecha utilizando velocidad explosiva y técnica en el regate.',
      'Desbordar al lateral contrario para enviar centros precisos al delantero centro.',
      'Trazar diagonales hacia el área para marcar goles o asociarse en corto.'
    ]
  },
  ei: {
    code: 'EI',
    name: 'Extremo Izquierdo',
    zone: 'Zona Ofensiva / Banda Izquierda',
    zoneColor: 'from-amber-900/60 to-amber-950/80 border-amber-500/40 text-amber-300',
    commonNumbers: '#11',
    description: 'Atacante punzante por el carril izquierdo. Especialista en abrir defensas cerradas mediante desborde, velocidad y encare 1 contra 1.',
    functions: [
      'Atacar por banda izquierda desbordando y superando rivales en velocidad.',
      'Asistir con centros rasos o elevados al delantero centro (#9).',
      'Finalizar jugadas cortando hacia el centro con remates a portería.'
    ]
  }
};

export const getTacticalData = (pos: string) => {
  const p = (pos || '').toLowerCase().trim();
  if (p === 'por' || p.includes('portero') || p.includes('guardameta')) return TACTICAL_INFO.por;
  if (p === 'dfc' || p.includes('central')) return TACTICAL_INFO.dfc;
  if (p === 'ld' || (p.includes('derecho') && p.includes('lateral'))) return TACTICAL_INFO.ld;
  if (p === 'li' || (p.includes('izquierdo') && p.includes('lateral'))) return TACTICAL_INFO.li;
  if (p === 'mcd' || (p.includes('defensivo') && p.includes('medio')) || p.includes('contención')) return TACTICAL_INFO.mcd;
  if (p === 'mco' || p.includes('ofensivo') || p.includes('mediapunta') || p.includes('enganche')) return TACTICAL_INFO.mco;
  if (p === 'ed' || p.includes('extremo derecho')) return TACTICAL_INFO.ed;
  if (p === 'ei' || p.includes('extremo izquierdo')) return TACTICAL_INFO.ei;
  if (p === 'dc' || p.includes('delantero centro') || p.includes('ariete')) return TACTICAL_INFO.dc;
  
  // Si en la base de datos dice genéricamente "Defensa", "Medio" o "Delantero", asignarlo a la línea principal
  if (p === 'defensa' || p.includes('def')) return TACTICAL_INFO.dfc;
  if (p === 'medio' || p === 'mc' || p.includes('med') || p.includes('mixto') || p.includes('todocampista')) return TACTICAL_INFO.mc;
  if (p === 'delantero' || p.includes('del') || p.includes('ext')) return TACTICAL_INFO.dc;
  
  return {
    code: pos?.toUpperCase() || 'JUG',
    name: pos || 'Jugador de Campo',
    zone: 'Zona Polivalente de Competición',
    zoneColor: 'from-slate-800 to-slate-900 border-slate-700 text-slate-300',
    commonNumbers: '#2 - #11',
    description: 'Jugador inscrito en la nómina oficial del club. Desempeña funciones tácticas polivalentes y de apoyo en el esquema de competición.',
    functions: [
      'Cumplir con el esquema táctico y roles asignados por el director técnico.',
      'Apoyar las transiciones defensivas y ofensivas del club en cada jornada.',
      'Mantener alto rendimiento físico y compañerismo en el terreno de juego.'
    ]
  };
};

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, delay = 0 }) => {
  const [imgError, setImgError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tactical = getTacticalData(player.position);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('');
  };

  const getPositionStyle = (pos: string) => {
    const p = pos.toLowerCase();
    if (p.includes('por')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10';
    if (p.includes('dfc') || p.includes('ld') || p.includes('li') || p.includes('def')) return 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sky-500/10';
    if (p.includes('mc') || p.includes('med')) return 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-purple-500/10';
    if (p.includes('dc') || p.includes('ed') || p.includes('ei') || p.includes('del')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10';
    return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
  };

  const hasValidPhoto = player.photoUrl && player.photoUrl.trim() !== '' && !imgError;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: 'spring', stiffness: 350, damping: 25 }}
        className="h-full"
      >
        <motion.div 
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
          className="h-full bg-[#0f172a]/95 hover:bg-[#162038] border border-slate-800/85 hover:border-amber-500/60 rounded-2xl p-5 transition-colors duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between group relative overflow-hidden cursor-pointer select-none"
        >
          {/* Resplandor sutil MARCA en hover */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

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
                <div className="w-full h-full flex flex-col items-center justify-center p-4 relative bg-gradient-to-b from-[#162038]/60 to-[#0b111e]">
                  {/* Número de Dorsal gigante de fondo */}
                  <span className="absolute text-8xl font-black text-slate-800/30 select-none tracking-tighter">
                    #{player.jerseyNumber || '0'}
                  </span>
                  
                  {/* Ícono atlético limpio e indicación clara del dorsal sin iniciales repetidas */}
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#1e293b]/90 border border-slate-700/80 flex items-center justify-center shadow-md mb-2 group-hover:scale-110 group-hover:border-amber-500/50 transition-all duration-300">
                      <span className="text-3xl select-none">👕</span>
                    </div>
                    <span className="text-xs font-black text-amber-400 tracking-widest uppercase bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800 shadow-sm">
                      Dorsal #{player.jerseyNumber || '0'}
                    </span>
                  </div>
                </div>
              )}

              {/* Etiqueta Flotante de Posición Táctica */}
              <div className="absolute top-2.5 right-2.5 z-20">
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-sm ${getPositionStyle(player.position)}`}>
                  {tactical.code} &bull; #{player.jerseyNumber || '0'}
                </span>
              </div>
            </div>

            {/* Nombre y Posición en Línea (A la par del nombre según requerimiento) */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-center mb-3">
              <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors duration-200 tracking-tight leading-snug">
                {player.name || 'Sin Nombre'}
              </h3>
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border tracking-wider uppercase shrink-0 shadow-sm ${getPositionStyle(player.position || '')}`}>
                {player.position || 'JUG'}
              </span>
            </div>

            {/* Botón táctil para Abrir Modal de Demarcaciones (Diseño mejorado de alta legibilidad) */}
            <div className="mb-4">
              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 border border-amber-300/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="text-sm">📖</span>
                <span>Ver Demarcación y Roles</span>
              </motion.button>
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

        </motion.div>
      </motion.div>

      {/* MODAL DE BURBUJA FLOTANTE EN PORTAL (Desacoplado de la grilla para no mover ni desbordar elementos) */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
              {/* Overlay oscuro con desenfoque */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-[#040711]/85 backdrop-blur-md cursor-pointer"
              />

              {/* Contenido del Modal tipo Burbuja Flotante */}
              <motion.div
                initial={{ opacity: 0, scale: 0.65, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.65, y: 40 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-2xl bg-gradient-to-br from-[#101828] via-[#0f172a] to-[#080d1a] border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto text-left"
              >
                {/* Resplandor superior */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* Encabezado del Modal */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-2xl font-black text-slate-950 shadow-lg border-2 border-slate-900 shrink-0">
                      #{player.jerseyNumber || '0'}
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
                        <span>Demarcación Oficial CONDEPOR</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex flex-wrap items-center gap-2">
                        <span>{player.name || 'Sin Nombre'}</span>
                        <span className={`text-sm font-black px-2.5 py-0.5 rounded-lg border uppercase ${getPositionStyle(player.position || '')}`}>
                          {player.position || 'JUG'}
                        </span>
                      </h2>
                      <p className="text-slate-400 text-sm font-semibold mt-0.5">
                        {tactical.name} ({tactical.code}) &bull; Dorsal Típico: {tactical.commonNumbers}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(false)}
                    className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors text-xl font-bold shrink-0 cursor-pointer"
                    aria-label="Cerrar modal"
                  >
                    &times;
                  </motion.button>
                </div>

                {/* Zona en el Campo y Descripción */}
                <div className={`p-4 rounded-2xl bg-gradient-to-r border mb-6 ${tactical.zoneColor}`}>
                  <div className="text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <span>📍 {tactical.zone}</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed opacity-95">
                    {tactical.description}
                  </p>
                </div>

                {/* Funciones Clave y Roles Tácticos en el Partido */}
                <div className="mb-6">
                  <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span>⚽ Funciones y Roles en el Terreno de Juego</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {tactical.functions.map((func, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-[#080d1a]/80 border border-slate-800/80 rounded-xl p-3 text-sm text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="leading-snug">{func}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Estadísticas en Temporada */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-5">
                  <div className="bg-[#080d1a] border border-slate-800 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-black text-amber-400">{player.seasonGoals || 0}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Goles en Temporada</div>
                  </div>
                  <div className="bg-[#080d1a] border border-slate-800 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-black text-sky-400">{player.seasonPoints !== undefined ? player.seasonPoints.toFixed(0) : 0}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Puntos de Rendimiento</div>
                  </div>
                </div>

                {/* Botón de Cierre inferior */}
                <div className="mt-6 text-right">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-sm tracking-wide transition-all duration-200 shadow-lg shadow-amber-500/30 cursor-pointer"
                  >
                    Entendido &bull; Cerrar Ficha Táctica
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
