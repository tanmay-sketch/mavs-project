// ===================================================================
// ScoutNotes component
// Path to this file: /src/components/ScoutNotes.jsx
// ===================================================================

import React, { useState } from 'react';
import { playerData } from '../utils/loadPlayerData';

export function ScoutRankings({ player }) {
  const getRankStatus = (rank) => {
    if (!rank || rank === 'N/A') return { text: 'N/A', color: 'text-gray-500 dark:text-gray-400' };
    if (rank <= 14) return { text: 'Lottery Pick', color: 'text-green-600 dark:text-green-400' };
    if (rank <= 30) return { text: 'First Round', color: 'text-blue-600 dark:text-blue-400' };
    if (rank <= 60) return { text: 'Second Round', color: 'text-yellow-600 dark:text-yellow-400' };
    return { text: 'Undrafted Range', color: 'text-red-600 dark:text-red-400' };
  };

  // Find rankings for this player from the scoutRankings array
  const playerRankings = playerData?.scoutRankings?.find(r => r.playerId === player?.playerId);

  // Transform rankings into the format we need
  const scouts = playerRankings ? 
    Object.entries(playerRankings)
      .filter(([key]) => key !== 'playerId')
      .map(([source, rank]) => ({
        source: source.replace(' Rank', ''), // Remove 'Rank' from the source name
        rank: rank || 'N/A'
      }))
      .sort((a, b) => {
        if (a.rank === 'N/A') return 1;
        if (b.rank === 'N/A') return -1;
        return a.rank - b.rank;
      })
    : [];

  // Get highest rank (excluding N/A)
  const highestRank = scouts.reduce((min, scout) => {
    if (scout.rank === 'N/A') return min;
    return Math.min(min, typeof scout.rank === 'number' ? scout.rank : Infinity);
  }, Infinity);

  const consensusRank = highestRank === Infinity ? 'N/A' : highestRank;

  // If no rankings are available, don't render the component
  if (scouts.length === 0) {
    return null;
  }

  return (
    <div className="bg-transparent border border-primary-200 dark:border-primary-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100">Scout Rankings</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
            Highest Rank #{consensusRank}
          </span>
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
                <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
                  #{scout.rank}
                </span>
                <span className={`text-sm font-medium ${rankStatus.color}`}>
                  {rankStatus.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ScoutReports({ player }) {
  const [newReport, setNewReport] = useState({
    scout: '',
    report: ''
  });
  const [tempReports, setTempReports] = useState([]);
  const [isAddingReport, setIsAddingReport] = useState(false);

  // Get real scouting reports for this player from the scoutingReports array
  const playerReports = playerData?.scoutingReports?.filter(r => r.playerId === player?.playerId) || [];
  const allReports = [...playerReports, ...tempReports];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!player?.playerId) return;
    
    const report = {
      ...newReport,
      playerId: player.playerId,
      reportId: `temp-${Date.now()}`, // Temporary ID for new reports
      date: new Date().toISOString().split('T')[0]
    };
    setTempReports([...tempReports, report]);
    setNewReport({ scout: '', report: '' });
    setIsAddingReport(false);
  };

  return (
    <div className="bg-transparent border border-primary-200 dark:border-primary-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100">Scouting Report</h2>
        <button
          onClick={() => setIsAddingReport(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Add Report
        </button>
      </div>

      {isAddingReport && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 border-b border-primary-200 dark:border-primary-700 pb-6">
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
              Scout Name
            </label>
            <input
              type="text"
              value={newReport.scout}
              onChange={(e) => setNewReport({ ...newReport, scout: e.target.value })}
              className="w-full px-3 py-2 border border-primary-300 dark:border-primary-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-primary-800 text-primary-900 dark:text-primary-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
              Report
            </label>
            <textarea
              value={newReport.report}
              onChange={(e) => setNewReport({ ...newReport, report: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-primary-300 dark:border-primary-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-primary-800 text-primary-900 dark:text-primary-100"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsAddingReport(false);
                setNewReport({ scout: '', report: '' });
              }}
              className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-transparent border border-primary-300 dark:border-primary-600 rounded-md hover:bg-primary-50 dark:hover:bg-primary-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add Report
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {allReports.map((report) => (
          <div key={report.reportId} className="border-b border-primary-200 dark:border-primary-700 last:border-0 pb-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
                    {report.scout}
                  </span>
                </div>
                {report.date && (
                  <p className="text-xs text-secondary-800 dark:text-secondary-500">
                    {report.date}
                  </p>
                )}
              </div>
              {report.reportId?.startsWith('temp-') && (
                <button
                  onClick={() => setTempReports(tempReports.filter(r => r.reportId !== report.reportId))}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-secondary-600 dark:text-secondary-300 whitespace-pre-wrap">
              {report.report}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 