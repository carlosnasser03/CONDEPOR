import React from 'react';
import { Player } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

interface PlayerCardProps {
  player: Player;
  delay?: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="text-center">
        {/* Photo */}
        {player.photoUrl ? (
          <img
            src={player.photoUrl}
            alt={player.name}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Sin foto</span>
          </div>
        )}

        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {player.name}
        </h3>

        {/* Position & Jersey */}
        <Badge variant="info" size="sm" className="mb-4">
          {player.position} #{player.jerseyNumber}
        </Badge>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xl font-bold text-secondary">
              {player.seasonGoals || 0}
            </div>
            <div className="text-xs text-gray-600">Goles</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xl font-bold text-primary">
              {player.seasonPoints ? player.seasonPoints.toFixed(0) : 0}
            </div>
            <div className="text-xs text-gray-600">Puntos</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
