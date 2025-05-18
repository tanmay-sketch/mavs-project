import React from 'react';
import StatCard from './StatCard';

export default function PlayerDetailsSection({ player, fullStats, isLoading, formatHeight, formatPercentage }) {
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

      <div className="grid grid-cols-3 gap-4 mb-6">
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

      <div className="border-t border-primary-200 dark:border-primary-700 pt-6">
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
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Games" value={fullStats.gamesPlayed || 0} />
              <StatCard label="Started" value={fullStats.gamesStarted || 0} />
              <StatCard label="Minutes" value={fullStats.mp || 0} />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 