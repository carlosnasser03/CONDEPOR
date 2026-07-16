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
      <section id="categories" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Categorías
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Selecciona una categoría para ver la tabla de posiciones, partidos
            y goleadores
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
