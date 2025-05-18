import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getFullSeasonAverages, playerData } from '../utils/loadPlayerData';
import PlayerDetailsSection from './PlayerDetailsSection';
import ScoutNotes from './ScoutNotes';

export default function PlayerProfile() {
  const location = useLocation();
  const player = location.state?.player;
  const [fullStats, setFullStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFullStats() {
      if (player) {
        setIsLoading(true);
        try {
          const playerFullStats = await getFullSeasonAverages(playerData, player.playerId);
          setFullStats(playerFullStats || {});
        } catch (error) {
          console.error('Error loading full stats:', error);
          setFullStats({});
        }
        setIsLoading(false);
      }
    }
    loadFullStats();
  }, [player]);

  const formatHeight = (inches) => {
    const ft = Math.floor(inches / 12);
    const inch = inches % 12;
    return `${ft}'${inch}"`;
  };

  const formatPercentage = (value) => {
    return value ? `${value.toFixed(1)}%` : 'N/A';
  };

  if (!player) {
    return (
      <div className="pt-16 min-h-screen bg-white dark:bg-primary-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-primary-900 dark:text-primary-100">
            Player not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-white dark:bg-primary-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Player Details */}
          <PlayerDetailsSection 
            player={player}
            fullStats={fullStats}
            isLoading={isLoading}
            formatHeight={formatHeight}
            formatPercentage={formatPercentage}
          />

          {/* Right Column - Scout Notes */}
          <div className="space-y-6">
            <ScoutNotes player={player} />
          </div>
        </div>
      </div>
    </div>
  );
} 