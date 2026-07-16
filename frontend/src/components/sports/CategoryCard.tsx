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
  color = '#2563eb',
  description,
  delay = 0,
}) => {
  return (
    <Link href={`/categories/${id}`} aria-label={`Ver detalles de la categoría ${name}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.4 }}
      >
        <Card hover className="text-center">
          {/* Color Indicator */}
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg shadow-md"
            style={{ backgroundColor: color }}
          >
            🏆
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}

          {/* CTA */}
          <div className="mt-4 text-primary font-semibold text-sm">
            Ver Detalles →
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};
