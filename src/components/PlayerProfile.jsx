import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getFullSeasonAverages, playerData } from '../utils/loadPlayerData';

function StatCard({ label, value, subValue }) {
  return (
    <div className="text-center">
      <p className="text-sm text-primary-800 dark:text-primary-300">{label}</p>
      <p className="font-bold text-primary-700 dark:text-primary-100">{value}</p>
      {subValue && (
        <p className="text-xs text-secondary-800 dark:text-secondary-500">{subValue}</p>
      )}
    </div>
  );
}

function PlayerHeader({ player, fullStats, formatHeight }) {
  return (
    <div className="bg-transparent border border-primary-200 dark:border-primary-700 rounded-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <img 
            src={player.photoUrl} 
            alt={player.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/96';
            }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-100">{player.name}</h1>
          <p className="text-secondary-600 dark:text-secondary-300">{player.currentTeam}</p>
          {fullStats.lastTeam && (
            <p className="text-sm text-secondary-500">Last Team: {fullStats.lastTeam}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-secondary-500">Height</p>
            <p className="font-medium text-primary-900 dark:text-primary-100">{formatHeight(player.height)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-secondary-500">Weight</p>
            <p className="font-medium text-primary-900 dark:text-primary-100">{player.weight} lbs</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-secondary-500">Rank</p>
            <p className="font-medium text-primary-900 dark:text-primary-100">#{player.rank || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerStats({ fullStats, isLoading, formatPercentage }) {
  return (
    <div className="bg-transparent border border-primary-200 dark:border-primary-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4">
        Detailed Statistics
        {isLoading && <span className="ml-2 text-sm text-secondary-500">(Loading...)</span>}
      </h2>
      
      {!isLoading && (
        <>
          {/* Per Game Stats */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-primary-900 dark:text-primary-100 mb-3">Per Game Averages</h3>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="PTS" value={fullStats.pts || 0} />
              <StatCard label="REB" value={fullStats.trb || 0} />
              <StatCard label="AST" value={fullStats.ast || 0} />
              <StatCard label="STL" value={fullStats.stl || 0} />
            </div>
          </div>

          {/* Shooting Stats */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-primary-900 dark:text-primary-100 mb-3">Shooting</h3>
            <div className="grid grid-cols-3 gap-4">
              <StatCard 
                label="FG%" 
                value={formatPercentage(fullStats.fgPercent)}
              />
              <StatCard 
                label="3P%" 
                value={formatPercentage(fullStats.threePercent)}
              />
              <StatCard 
                label="FT%" 
                value={formatPercentage(fullStats.ftPercent)}
              />
            </div>
          </div>

          {/* Games Info */}
          <div className="mt-6 pt-4 border-t border-primary-200 dark:border-primary-700">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Games" value={fullStats.gamesPlayed || 0} />
              <StatCard label="Started" value={fullStats.gamesStarted || 0} />
              <StatCard label="Minutes" value={fullStats.mp || 0} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ScoutNotes() {
  return (
    <div className="bg-transparent border border-primary-200 dark:border-primary-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4">Scout Notes</h2>
      <div className="space-y-4">
        {[
          {
            date: "2024-03-15",
            note: "Excellent court vision and passing ability. Shows great potential in pick-and-roll situations.",
            scout: "John Doe"
          },
          {
            date: "2024-03-10",
            note: "Strong defensive instincts. Need to work on lateral quickness.",
            scout: "Jane Smith"
          }
        ].map((note, index) => (
          <div key={index} className="border-b border-primary-200 dark:border-primary-700 last:border-0 pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-primary-900 dark:text-primary-100">{note.scout}</span>
              <span className="text-sm text-secondary-500">{note.date}</span>
            </div>
            <p className="text-secondary-600 dark:text-secondary-300">{note.note}</p>
          </div>
        ))}
      </div>
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
          <div className="space-y-8">
            <PlayerHeader 
              player={player} 
              fullStats={fullStats} 
              formatHeight={formatHeight} 
            />
            <PlayerStats 
              fullStats={fullStats} 
              isLoading={isLoading} 
              formatPercentage={formatPercentage} 
            />
          </div>

          {/* Right Column - Scout Notes */}
          <ScoutNotes />
        </div>
      </div>
    </div>
  );
} 