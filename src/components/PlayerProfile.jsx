import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getFullSeasonAverages, playerData } from '../utils/loadPlayerData';
import PlayerDetailsSection from './PlayerDetailsSection';
import { ScoutRankings, ScoutReports } from './ScoutNotes';
import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';

function PlayerStatsRadar({ stats, player }) {
  if (!stats || Object.keys(stats).length === 0) return null;

  console.log(stats);

  const radarData = [
    stats.pts || 0,
    stats.ast || 0,
    stats.trb || 0,
    stats.blk || 0,
    stats.stl || 0,
  ]
  
  return (
    <div className="bg-white dark:bg-primary-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-primary-900 dark:text-primary-100">Season Averages</h3>
      <RadarChart
        height={300}
        series={[
          {
            // label: player?.name || 'Player',
            data: radarData,
          },
        ]}
        radar={{
          max: 0,
          metrics: [
            { name: 'Points', max: 40 },
            { name: 'Assists', max: 15 },
            { name: 'Rebounds', max: 25 },
            { name: 'Blocks', max: 15 },
            { name: 'Steals', max: 15 },
            { name: 'FG%', max: 100 },
          ],
        }}
      />
    </div>
  );
}

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
            <PlayerStatsRadar stats={fullStats} player={player}/>

            {/* Bottom Section - Full width Scout Reports */}
            <ScoutReports player={player} />
          </div>
        </div>
      </main>
    </div>
  );
} 