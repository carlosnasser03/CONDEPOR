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
        <Card hover className="text-center bg-[#0f172a]/95 border border-slate-800/85 hover:border-amber-500/60 shadow-lg rounded-2xl transition-colors">
          {/* Color Indicator */}
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-amber-500/10 border border-white/10 group-hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
          >
            🏆
          </div>

          {/* Title */}
          <h3 className="text-lg font-black text-white mb-2 tracking-tight">{name}</h3>

          {/* Description */}
          {description && (
            <p className="text-sm font-medium text-slate-400 line-clamp-2">{description}</p>
          )}

          {/* CTA */}
          <div className="mt-4 inline-flex items-center gap-1 text-amber-400 font-bold text-xs tracking-wider uppercase">
            <span>Ver Categoría</span>
            <span>→</span>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};
