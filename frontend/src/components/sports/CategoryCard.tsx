import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

interface CategoryCardProps {
  id: string;
  name: string;
  color?: string;
  description?: string;
  delay?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  color = '#f59e0b',
  description,
  delay = 0,
}) => {
  return (
    <Link href={`/categories/${id}`} aria-label={`Ver detalles de la categoría ${name}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.04, y: -4 }}
        whileTap={{ scale: 0.96 }}
        transition={{ delay, type: 'spring', stiffness: 420, damping: 25 }}
      >
        <Card hover className="text-center group bg-[#0f172a]/95 border border-slate-800/85 hover:border-amber-500/60 shadow-lg rounded-2xl transition-all duration-300">
          {/* Color Indicator */}
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-amber-500/10 border border-white/10 group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: color }}
          >
            🏆
          </div>

          {/* Title */}
          <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors duration-300 mb-2 tracking-tight leading-snug">
            {name || 'Categoría Oficial'}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm font-medium text-slate-300 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* CTA */}
          <div className="mt-5 inline-flex items-center gap-1.5 text-amber-400 group-hover:text-amber-300 font-extrabold text-xs tracking-wider uppercase transition-colors duration-200">
            <span>Ver Categoría</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};
