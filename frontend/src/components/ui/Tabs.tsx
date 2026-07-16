'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab = tabs[0]?.id || '',
  onChange,
  children,
}) => {
  const [active, setActive] = useState(defaultTab);

  const handleTabClick = (tabId: string) => {
    setActive(tabId);
    onChange?.(tabId);
  };

  return (
    <div className="w-full">
      {/* Botonera de Pestañas Flotantes tipo Burbuja */}
      <div
        role="tablist"
        className="inline-flex flex-wrap items-center gap-2 p-2 bg-[#111827]/90 border border-slate-800/80 rounded-2xl mb-8 shadow-inner"
      >
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <motion.button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabClick(tab.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              className={`
                relative px-4 py-2.5 rounded-xl font-black text-sm tracking-wide transition-colors z-10 flex items-center gap-2 cursor-pointer select-none
                ${isActive ? 'text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'}
              `}
            >
              {/* Indicador Burbuja de Fondo para Pestaña Activa */}
              {isActive && (
                <motion.div
                  layoutId="bubbleTabIndicator"
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-xl shadow-md shadow-amber-500/30 -z-10"
                />
              )}
              {tab.icon && <span className="text-base shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Contenido de Pestaña con Animación Suave de Entrada */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          role="tabpanel"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
