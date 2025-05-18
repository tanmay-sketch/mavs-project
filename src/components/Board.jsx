import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import loadPlayerData from '../utils/loadPlayerData';

export default function Board() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const playerData = await loadPlayerData();
        console.log('Board received player data:', playerData[0]);
        setPlayers(playerData);
      } catch (error) {
        console.error('Error loading player data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="pt-16 bg-gray-100 dark:bg-primary-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <h1 className="text-3xl font-bold text-primary-900 dark:text-primary-50 mb-8 text-center">
          2024 NBA Draft Prospects
        </h1> */}
        
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