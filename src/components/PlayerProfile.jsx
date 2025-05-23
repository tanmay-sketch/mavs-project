import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPlayerStats } from '../utils/loadPlayerData';
import PlayerDetailsSection from './PlayerDetailsSection';
import { ScoutRankings, ScoutReports } from './ScoutNotes';
import PlayerStatsRadar from './PlayerStatsRadar';

export default function PlayerProfile() {
  const location = useLocation();
  const player = location.state?.player;
  const [fullStats, setFullStats] = useState({});
  const [logsBySeason, setLogsBySeason] = useState({});
  const [seasons, setSeasons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFullStats() {
      if (player) {
        setIsLoading(true);
        try {
          const playerStats = getPlayerStats(player.playerId);
          if (playerStats) {
            setFullStats(playerStats.seasonAverages || {});
            setLogsBySeason(playerStats.logsBySeason || {});
            setSeasons(Object.keys(playerStats.logsBySeason || {}).sort((a, b) => b - a)); // Sort seasons descending
          } else {
            setFullStats({});
            setLogsBySeason({});
            setSeasons([]);
          }
        } catch (error) {
          console.error('Error loading full stats:', error);
          setFullStats({});
          setLogsBySeason({});
          setSeasons([]);
        }
        setIsLoading(false);
      }
    }
    loadFullStats();

    // Scroll to top when component mounts or player changes
    window.scrollTo(0, 0);
  }, [player]);

  const formatHeight = (inches) => {
    const ft = Math.floor(inches / 12);
    const inch = inches % 12;
    return `${ft}'${inch}"`;
  };

  const formatPercentage = (value) => {
    return value !== undefined && value !== null ? `${value.toFixed(1)}%` : 'N/A';
  };

  if (!player) {
    return (
      <div className="min-h-screen bg-white dark:bg-primary-900">
        <main className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-primary-900 dark:text-primary-100">
              Player not found
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-primary-900">
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Top Section - Player Details and Rankings side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Player Details */}
              <PlayerDetailsSection 
                player={player}
                fullStats={fullStats}
                isLoading={isLoading}
                formatHeight={formatHeight}
                formatPercentage={formatPercentage}
              />

              {/* Scout Rankings */}
              <ScoutRankings player={player} />
            </div>

            {/* Stats Radar Chart */}
            <PlayerStatsRadar 
              stats={fullStats} 
              logsBySeason={logsBySeason}
              seasons={seasons}
            />

            {/* Bottom Section - Full width Scout Reports */}
            <ScoutReports player={player} />
          </div>
        </div>
      </main>
    </div>
  );
} 