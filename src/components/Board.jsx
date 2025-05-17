import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import loadPlayerData from '../utils/loadPlayerData';

export default function Board() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const playerData = await loadPlayerData();
      setPlayers(playerData);
    };
    loadData();
  }, []);

  return (
    <div className="pt-16 bg-gray-100 dark:bg-primary-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {players.map((player) => (
            <PlayerCard key={player.playerId} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
} 