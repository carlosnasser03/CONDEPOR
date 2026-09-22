'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLandingCategories } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CategoryCardSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/ui/Card';
import { VideoBackground } from '@/components/landing/VideoBackground';
import Link from 'next/link';

export default function JugadoresLanding() {
  const router = useRouter();
  const { data: categories, loading, error } = useLandingCategories();

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/landing/jugadores/${categoryId}`);
  };

  return (
    <>
      <VideoBackground />
      <div className="relative min-h-screen px-4 py-20">
        <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-slate-400 mb-12"
        >
          <Link href="/landing" className="text-amber-400 hover:text-amber-300 transition-colors">
            Landing
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-medium">Para Jugadores</span>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
              ¿Quién Anota Más Goles?
            </h1>
            <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto mb-2">
              Descubre los máximos goleadores de cada categoría y sigue sus estadísticas
            </p>
            <p className="text-sm text-slate-500">
              Selecciona una categoría para ver el ranking
            </p>
          </div>
        </motion.div>

        {/* Categories Grid */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </motion.div>
        )}

        {error && (
          <EmptyState
            icon="❌"
            title="Error al cargar categorías"
            description="No pudimos cargar las categorías disponibles. Por favor, intenta recargar la página."
          />
        )}

        {!loading && !error && categories && categories.length === 0 && (
          <EmptyState
            icon="📋"
            title="Sin categorías disponibles"
            description="Por el momento no hay categorías disponibles. Intenta más tarde."
          />
        )}

        {!loading && !error && categories && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleCategorySelect(category.id)}
                className="cursor-pointer"
              >
                <Card
                  hover
                  className="h-full text-center group bg-gradient-to-br from-[#0f172a] to-[#111827] border border-slate-800/85 hover:border-amber-500/60 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center p-8"
                >
                  <motion.div
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-amber-500/10 border border-white/10 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: category.color || '#f59e0b' }}
                  >
                    ⭐
                  </motion.div>

                  <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors duration-300 mb-2 tracking-tight">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="text-sm font-medium text-slate-300 line-clamp-2 leading-relaxed mb-6">
                      {category.description}
                    </p>
                  )}

                  <div className="mt-auto inline-flex items-center gap-1.5 text-amber-400 group-hover:text-amber-300 font-extrabold text-xs tracking-wider uppercase transition-colors duration-200">
                    <span>Ver Goleadores</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
        </div>
      </div>
    </>
  );
}
