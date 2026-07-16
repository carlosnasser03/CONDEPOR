import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  animationUrl?: string; // URL que proporciona el usuario
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  animationUrl = '',
}) => {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-primary via-primary-light to-secondary flex items-center justify-center overflow-hidden">
      {/* Background Animation Container */}
      {animationUrl && (
        <div className="absolute inset-0 z-0">
          <iframe
            src={animationUrl}
            className="w-full h-full"
            style={{
              border: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {/* Fallback gradient if no animation */}
      {!animationUrl && (
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary-light/20 rounded-full"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            ⚽ DeporteHN
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Gestión integral de ligas y torneos de fútbol
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              // Scroll to categories
              document.getElementById('categories')?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
          >
            Explorar Categorías
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-primary"
          >
            Ver Más
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 z-10 text-center"
      >
        <p className="text-white/70 text-sm mb-2">Desplázate para continuar</p>
        <div className="text-white/50">↓</div>
      </motion.div>
    </div>
  );
};
