import React from 'react';
import StatCard from './StatCard';

export default function PlayerDetailsSection({ player, fullStats, isLoading, formatHeight, formatPercentage }) {
  return (
    <div className="bg-transparent border border-primary-200 dark:border-primary-700 rounded-lg p-6">
      <div className="flex items-start space-x-6">
        {/* Left side - Photo and basic info */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img 
              src={player.photoUrl} 
              alt={player.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/128';
              }}
            />
          </div>
          <div className="text-center">
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="text-center">
                <p className="text-xs text-secondary-500">Height</p>
                <p className="text-sm font-medium text-primary-900 dark:text-primary-100">{formatHeight(player.height)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-secondary-500">Weight</p>
                <p className="text-sm font-medium text-primary-900 dark:text-primary-100">{player.weight} lbs</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-secondary-500">Rank</p>
                <p className="text-sm font-medium text-primary-900 dark:text-primary-100">#{player.rank || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Stats */}
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-100">{player.name}</h1>
            <p className="text-secondary-600 dark:text-secondary-300">{player.currentTeam}</p>
            {fullStats.lastTeam && (
              <p className="text-sm text-secondary-500">Last Team: {fullStats.lastTeam}</p>
            )}
          </div>

          {isLoading ? (
            <div className="text-sm text-secondary-500">Loading stats...</div>
          ) : (
            <div className="space-y-6">
              {/* Per Game Stats */}
              <div>
                <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">Per Game</h3>
                <div className="grid grid-cols-4 gap-3">
                  <StatCard label="PTS" value={fullStats.pts || 0} />
                  <StatCard label="REB" value={fullStats.trb || 0} />
                  <StatCard label="AST" value={fullStats.ast || 0} />
                  <StatCard label="STL" value={fullStats.stl || 0} />
                </div>
              </div>

              {/* Shooting Stats */}
              <div>
                <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">Shooting</h3>
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="FG%" value={formatPercentage(fullStats.fgPercent)} />
                  <StatCard label="3P%" value={formatPercentage(fullStats.threePercent)} />
                  <StatCard label="FT%" value={formatPercentage(fullStats.ftPercent)} />
                </div>
              </div>

              {/* Games Info */}
              <div>
                <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">Season</h3>
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Games" value={fullStats.gamesPlayed || 0} />
                  <StatCard label="Started" value={fullStats.gamesStarted || 0} />
                  <StatCard label="Minutes" value={fullStats.mp || 0} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 