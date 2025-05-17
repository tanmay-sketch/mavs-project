import React from 'react';
import Avatar from '@mui/material/Avatar';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';

export default function PlayerCard({ player }) {
  // Helper to convert inches to feet/inches
  const formatHeight = (inches) => {
    const ft = Math.floor(inches / 12);
    const inch = inches % 12;
    return `${ft}'${inch}"`;
  };

  return (
    <div className="relative bg-white dark:bg-primary-800 rounded-xl shadow-lg w-full max-w-xs mx-auto flex flex-col items-center p-6 gap-3 border border-primary-200 dark:border-primary-700">
      {/* Rank Badge */}
      <div className="absolute top-3 left-3 bg-primary-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-md">
        {player.rank || 'N/A'}
      </div>

      {/* Avatar */}
      <Avatar src={player.photoUrl} alt={player.name} sx={{ width: 72, height: 72, mb: 1 }} />

      {/* Name and Team/Position */}
      <div className="flex flex-col items-center text-center">
        <span className="text-lg font-bold text-primary-900 dark:text-primary-50 leading-tight">{player.name}</span>
        <span className="text-sm text-primary-700 dark:text-primary-200 mt-0.5">{player.position || 'SF/PF'} | {player.currentTeam}</span>
      </div>

      {/* Physical Info */}
      <div className="flex justify-center gap-4 text-xs text-primary-600 dark:text-primary-300 mt-1">
        <span>{formatHeight(player.height)}</span>
        <span>{player.weight} lbs</span>
        <span>{player.age ? `${player.age} yrs` : '18.5 yrs'}</span>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-primary-100 dark:border-primary-700 my-2" />

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-2 w-full text-center">
        <div>
          <div className="text-xs text-primary-500 dark:text-primary-300">PTS</div>
          <div className="font-bold text-green-600 text-lg">{player.pts}</div>
        </div>
        <div>
          <div className="text-xs text-primary-500 dark:text-primary-300">REB</div>
          <div className="font-bold text-green-600 text-lg">{player.reb}</div>
        </div>
        <div>
          <div className="text-xs text-primary-500 dark:text-primary-300">AST</div>
          <div className="font-bold text-green-600 text-lg">{player.ast}</div>
        </div>
        <div>
          <div className="text-xs text-primary-500 dark:text-primary-300">BLK</div>
          <div className="font-bold text-green-600 text-lg">{player.blk}</div>
        </div>
        <div>
          <div className="text-xs text-primary-500 dark:text-primary-300">STL</div>
          <div className="font-bold text-green-600 text-lg">{player.stl}</div>
        </div>
      </div>
    </div>
  );
}