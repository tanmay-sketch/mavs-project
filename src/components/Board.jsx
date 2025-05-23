import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import { loadPlayerData } from '../utils/loadPlayerData';

export default function Board() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rank');

  useEffect(() => {
    const loadData = async () => {
      try {
        const playerData = await loadPlayerData(sortBy);
        // console.log('Board received player data:', playerData[0]);
        setPlayers(playerData);
      } catch (error) {
        console.error('Error loading player data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [sortBy]);

  const sortOptions = [
    { value: 'rank', label: 'Rank' },
    { value: 'pts', label: 'Points' },
    { value: 'reb', label: 'Rebounds' },
    { value: 'ast', label: 'Assists' },
    { value: 'blk', label: 'Blocks' },
    { value: 'stl', label: 'Steals' },
    { value: 'fgPercent', label: 'FG%' },
    { value: 'threePercent', label: '3P%' },
    { value: 'ftPercent', label: 'FT%' },
    { value: 'gamesPlayed', label: 'Games Played' }
  ];

  return (
    <div className="pt-16 bg-gray-100 dark:bg-primary-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-6">
          <div className="inline-flex items-center">
            <label className="mr-2 text-sm font-medium text-primary-900 dark:text-primary-100">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-primary-800 border border-primary-300 dark:border-primary-700 rounded-md shadow-sm py-1 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {players.map((player) => (
              <PlayerCard key={player.playerId} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 