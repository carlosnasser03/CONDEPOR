'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { HeroVideo } from '@/components/landing/HeroVideo';

export default function LandingHub() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
  };

  return (
    <>
      <HeroVideo />
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl relative z-10"
        >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl font-bold mb-6 shadow-lg">
            ⚽
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            CONDEPOR
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Selecciona cómo deseas explorar nuestro contenido
          </p>
        </motion.div>

        {/* CTA Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Para Padres */}
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/landing/parents')}
            className="cursor-pointer"
          >
            <Card hover className="h-full bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 hover:border-blue-400/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center group transition-all duration-300">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                👨‍👩‍👧‍👦
              </div>
              <h2 className="text-2xl font-black text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                Para Padres
              </h2>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Mira los partidos de tu hijo en tiempo real
              </p>
              <div className="inline-flex items-center gap-2 text-blue-400 group-hover:text-blue-300 font-bold text-sm">
                Ver Partidos <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </div>
            </Card>
          </motion.div>

          {/* Para Jugadores */}
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/landing/jugadores')}
            className="cursor-pointer"
          >
            <Card hover className="h-full bg-gradient-to-br from-amber-900/40 to-amber-800/20 border border-amber-500/30 hover:border-amber-400/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center group transition-all duration-300">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                ⭐
              </div>
              <h2 className="text-2xl font-black text-white mb-3 group-hover:text-amber-300 transition-colors duration-300">
                Para Jugadores
              </h2>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Descubre quién anota más goles
              </p>
              <div className="inline-flex items-center gap-2 text-amber-400 group-hover:text-amber-300 font-bold text-sm">
                Ver Goleadores <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.div variants={itemVariants} className="text-center mt-12">
          <p className="text-slate-500 text-sm">
            Elige una opción para comenzar a explorar
          </p>
        </motion.div>
      </motion.div>
      </div>
    </>
  );
}
