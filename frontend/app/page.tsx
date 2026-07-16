'use client';

import { HeroSection } from '@/components/sports/HeroSection';
import { CategoryCard } from '@/components/sports/CategoryCard';
import { useCategories } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

const ANIMATION_URL = process.env.NEXT_PUBLIC_HERO_ANIMATION_URL || '';

export default function Home() {
  const { data: categories, loading, error } = useCategories();

  return (
    <>
      {/* Hero Section */}
      <HeroSection animationUrl={ANIMATION_URL} />

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

          {loading && <LoadingSpinner />}

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
