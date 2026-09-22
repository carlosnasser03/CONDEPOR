'use client';

import React from 'react';
import { Category } from '@/types';
import { Card } from '@/components/ui/Card';
import { CategoryCardSkeleton } from '@/components/common/Skeleton';
import { motion } from 'framer-motion';

/**
 * CategorySelector Component
 *
 * Displays a grid of selectable category cards with visual feedback.
 *
 * Props:
 * - categories: Array of Category objects to display
 * - loading: Show skeleton loaders while data is loading
 * - onSelect: Callback when a category is clicked (receives category id)
 * - selectedId: Currently selected category id (shows checkmark)
 */
interface CategorySelectorProps {
  categories: Category[];
  loading: boolean;
  onSelect: (id: string) => void;
  selectedId?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  loading,
  onSelect,
  selectedId,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📦</div>
        <h3 className="text-lg font-bold text-slate-200 mb-2">
          No hay categorías disponibles
        </h3>
        <p className="text-slate-400 text-sm">
          Vuelve más tarde para ver las categorías disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {categories.map((category, index) => {
        const isSelected = selectedId === category.id;

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card
              onClick={() => onSelect(category.id)}
              hover
              animationDelay={index * 0.05}
              className={`relative cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#080d1a]'
                  : ''
              }`}
            >
              <div className="text-center">
                {/* Color Indicator */}
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-lg border border-white/10 transition-transform duration-300 hover:scale-110"
                  style={{
                    backgroundColor: category.color || '#f59e0b',
                  }}
                  aria-label={`Categoría ${category.name}`}
                >
                  🏆
                </div>

                {/* Category Name */}
                <h3 className="text-lg font-black text-white mb-1 tracking-tight leading-snug line-clamp-2">
                  {category.name}
                </h3>

                {/* Description */}
                {category.description && (
                  <p className="text-xs sm:text-sm text-slate-400 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                {/* Selected Checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg"
                    aria-label="Seleccionado"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
