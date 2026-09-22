'use client';

import { HeroSection } from '@/components/sports/HeroSection';
import { CategoryCard } from '@/components/sports/CategoryCard';
import { useCategories } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CategoryCardSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ANIMATION_URL = process.env.NEXT_PUBLIC_HERO_ANIMATION_URL || '';

export default function Home() {
  const { data: categories, loading, error } = useCategories();

  return (
    <>
      {/* Hero Section */}
      <HeroSection animationUrl={ANIMATION_URL} />

      {/* Landing Page CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#0f172a] to-[#0b111e] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
              Página de Landing Pública
            </h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto">
              Accede a la versión simplificada diseñada para padres e hijos
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
          >
            {/* Para Padres */}
            <Link href="/landing/parents">
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer h-full"
              >
                <Card
                  hover
                  className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-500/30 hover:border-blue-400/60 rounded-2xl p-8 text-center group transition-all duration-300 h-full flex flex-col items-center justify-center"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    👨‍👩‍👧‍👦
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-blue-300 transition-colors duration-300 mb-3">
                    Para Padres
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    Ver los partidos de tu hijo en tiempo real
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-blue-400 group-hover:text-blue-300 font-bold text-sm">
                    Ir al Landing <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </Card>
              </motion.div>
            </Link>

            {/* Para Jugadores */}
            <Link href="/landing/jugadores">
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer h-full"
              >
                <Card
                  hover
                  className="bg-gradient-to-br from-amber-900/30 to-amber-800/10 border border-amber-500/30 hover:border-amber-400/60 rounded-2xl p-8 text-center group transition-all duration-300 h-full flex flex-col items-center justify-center"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    ⭐
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors duration-300 mb-3">
                    Para Jugadores
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    Descubre quién anota más goles
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-amber-400 group-hover:text-amber-300 font-bold text-sm">
                    Ir al Landing <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categorías */}
      <section id="categories" role="region" aria-label="Sección principal de Categorías" className="py-20 px-4 bg-[#0b111e] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-center text-white mb-4 tracking-tight drop-shadow-md">
            Categorías Oficiales
          </h2>
          <p className="text-center text-slate-400 font-medium mb-12 max-w-2xl mx-auto text-sm sm:text-base">
            Selecciona una categoría para ver la tabla de posiciones, partidos
            y goleadores en tiempo real
          </p>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          )}

          {error && (
            <EmptyState
              icon="❌"
              title="Error al cargar categorías"
              description="Intenta recargar la página o verifica que el servidor en el puerto 4000 esté encendido."
            />
          )}

          {categories && categories.length === 0 && !loading && !error && (
            <EmptyState
              icon="📋"
              title="Sin categorías"
              description="No hay categorías disponibles"
            />
          )}

          {categories && categories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  {...category}
                  delay={index * 0.1}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
