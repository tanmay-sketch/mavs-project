import React from 'react';
import { playerData } from '../utils/loadPlayerData';

// Dummy scout notes data - will be replaced with real data later
const dummyScoutNotes = {
  defaultNotes: [
    {
      scout: "Draft Express",
      source: "Scouting Report",
      date: "2024-03-01",
      report: "Shows great potential with excellent size and athleticism. Good shooting mechanics with room for improvement. Needs to work on defensive consistency."
    },
    {
      scout: "NBA Draft Room",
      source: "Pre-Draft Analysis",
      date: "2024-02-15",
      report: "High basketball IQ with good court vision. Strong fundamentals and work ethic. Could improve lateral quickness and strength."
    },
    {
      scout: "The Athletic",
      source: "Draft Profile",
      date: "2024-02-01",
      report: "Projects as a versatile player at the next level. Good shooting touch from all three levels. Needs to improve ball handling under pressure."
    }
  ]
};

// Dummy scout rankings for when real data is not available
const dummyScoutRankings = [
  { source: "ESPN", rank: "N/A" },
  { source: "The Athletic", rank: "N/A" },
  { source: "NBA Draft Room", rank: "N/A" },
  { source: "Draft Express", rank: "N/A" }
];

export default function ScoutNotes({ player }) {
  const getRankStatus = (rank) => {
    if (!rank) return { text: 'N/A', color: 'text-gray-500 dark:text-gray-400' };
    if (rank <= 14) return { text: 'Lottery Pick', color: 'text-green-600 dark:text-green-400' };
    if (rank <= 30) return { text: 'First Round', color: 'text-blue-600 dark:text-blue-400' };
    if (rank <= 60) return { text: 'Second Round', color: 'text-yellow-600 dark:text-yellow-400' };
    return { text: 'Undrafted Range', color: 'text-red-600 dark:text-red-400' };
  };

  // Get all scout rankings for this player
  const scoutRankings = playerData?.scoutRankings?.find(r => r.playerId === player.playerId) || {};
  const scouts = scoutRankings.playerId ? 
    Object.entries(scoutRankings)
      .filter(([key]) => key !== 'playerId')
      .map(([source, rank]) => ({
        source,
        rank: rank || 'N/A'
      }))
      .sort((a, b) => {
        if (a.rank === 'N/A') return 1;
        if (b.rank === 'N/A') return -1;
        return a.rank - b.rank;
      })
    : dummyScoutRankings;

  // Get highest rank (excluding N/A)
  const highestRank = scouts.reduce((min, scout) => {
    if (scout.rank === 'N/A') return min;
    return Math.min(min, typeof scout.rank === 'number' ? scout.rank : Infinity);
  }, Infinity);

  const consensusRank = highestRank === Infinity ? 'N/A' : highestRank;

  // Get scouting reports - use dummy data if no specific reports exist
  const scoutingReports = dummyScoutNotes.defaultNotes;

  return (
    <div className="space-y-6">
      {/* Rankings Section */}
      <div className="bg-transparent border border-primary-200 dark:border-primary-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100">Scout Rankings</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-primary-900 dark:text-primary-100">Highest Rank #{consensusRank}</span>
            <span className={`text-sm font-medium ${getRankStatus(consensusRank === 'N/A' ? null : consensusRank).color}`}>
              ({getRankStatus(consensusRank === 'N/A' ? null : consensusRank).text})
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {scouts.map((scout, index) => {
            const rankStatus = getRankStatus(scout.rank === 'N/A' ? null : scout.rank);
            return (
              <div key={index} className="flex items-center justify-between py-2 border-b border-primary-200 dark:border-primary-700 last:border-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
                    {scout.source}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-primary-900 dark:text-primary-100">#{scout.rank}</span>
                  <span className={`text-sm font-medium ${rankStatus.color}`}>
                    {rankStatus.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scouting Reports Section */}
      <div className="bg-transparent border border-primary-200 dark:border-primary-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-6">Scout Notes</h2>
        <div className="space-y-6">
          {scoutingReports.map((report, index) => (
            <div key={index} className="border-b border-primary-200 dark:border-primary-700 last:border-0 pb-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
                      {report.scout}
                    </span>
                    <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-800 rounded-full text-primary-700 dark:text-primary-300">
                      {report.source}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-800 dark:text-secondary-500">
                    {report.date}
                  </p>
                </div>
              </div>
              <p className="text-secondary-600 dark:text-secondary-300 whitespace-pre-wrap">
                {report.report}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 