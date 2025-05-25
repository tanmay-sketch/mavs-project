import React from 'react';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import StatCard from './StatCard';

export default function PlayerDetailsSection({ player, fullStats, isLoading, formatHeight, formatPercentage }) {
  return (
    <div className="bg-transparent border border-primary-200 dark:border-primary-700 rounded-lg p-6">
      <div className="flex items-center space-x-6">
        <Avatar 
          src={player.photoUrl} 
          alt={player.name}
          sx={{ width: 120, height: 120 }}
          className="ring-2 ring-primary-200 dark:ring-primary-700"
        >
          <PersonIcon sx={{ fontSize: 60 }} />
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-100">{player.name}</h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-300">{player.currentTeam}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-secondary-600 dark:text-secondary-300">
              Height: {formatHeight(player.height)}
            </p>
            <p className="text-sm text-secondary-600 dark:text-secondary-300">
              Weight: {player.weight} lbs
            </p>
          </div>
        </div>
      </div>

      {!isLoading && fullStats && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4">Season Averages</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Points</p>
              <p className="text-lg font-semibold text-primary-900 dark:text-primary-100">{fullStats.pts || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Rebounds</p>
              <p className="text-lg font-semibold text-primary-900 dark:text-primary-100">{fullStats.trb || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Assists</p>
              <p className="text-lg font-semibold text-primary-900 dark:text-primary-100">{fullStats.ast || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">FG%</p>
              <p className="text-lg font-semibold text-primary-900 dark:text-primary-100">{formatPercentage(fullStats.fgPercent)}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">3P%</p>
              <p className="text-lg font-semibold text-primary-900 dark:text-primary-100">{formatPercentage(fullStats.threePercent)}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">FT%</p>
              <p className="text-lg font-semibold text-primary-900 dark:text-primary-100">{formatPercentage(fullStats.ftPercent)}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Blocks</p>
              <p className="text-lg font-semibold text-primary-900 dark:text-primary-100">{fullStats.blk || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Steals</p>
              <p className="text-lg font-semibold text-primary-900 dark:text-primary-100">{fullStats.stl || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 