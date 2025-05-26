// ===================================================================
// PlayerStatsRadar component
// Path to this file: /src/components/PlayerStatsRadar.jsx
// ===================================================================

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PlayerStatsRadar({ stats, logsBySeason, seasons }) {
  const [statType, setStatType] = useState('points');
  const [selectedSeason, setSelectedSeason] = useState(null);

  useEffect(() => {
    if (seasons && seasons.length > 0) {
      setSelectedSeason(seasons[0]);
    }
  }, [seasons]);

  if (!stats || Object.keys(stats).length === 0) return null;

  // Season Stats Configuration
  const seasonLogs = selectedSeason ? (logsBySeason[selectedSeason] || []) : [];
  
  const statOptions = {
    points: {
      label: 'Points',
      data: seasonLogs.map(log => log.PTS || 0),
      color: 'rgba(255, 0, 0, 0.7)',
      borderColor: 'rgba(255, 0, 0, 1)'
    },
    assists: {
      label: 'Assists',
      data: seasonLogs.map(log => log.AST || 0),
      color: 'rgba(0, 128, 255, 0.7)',
      borderColor: 'rgba(0, 128, 255, 1)'
    },
    rebounds: {
      label: 'Rebounds',
      data: seasonLogs.map(log => (log.ORB || 0) + (log.DRB || 0)),
      color: 'rgba(0, 255, 0, 0.7)',
      borderColor: 'rgba(0, 255, 0, 1)'
    },
    steals: {
      label: 'Steals',
      data: seasonLogs.map(log => log.STL || 0),
      color: 'rgba(255, 165, 0, 0.7)',
      borderColor: 'rgba(255, 165, 0, 1)'
    },
    blocks: {
      label: 'Blocks',
      data: seasonLogs.map(log => log.BLK || 0),
      color: 'rgba(128, 0, 128, 0.7)',
      borderColor: 'rgba(128, 0, 128, 1)'
    }
  };

  const currentStat = statOptions[statType];

  const lineChartData = {
    labels: seasonLogs.map((_, index) => `Game ${index + 1}`),
    datasets: [
      {
        label: currentStat.label,
        data: currentStat.data,
        backgroundColor: currentStat.color,
        borderColor: currentStat.borderColor,
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${currentStat.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(128, 128, 128, 0.2)'
        },
        ticks: {
          color: 'rgba(128, 128, 128, 0.8)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(128, 128, 128, 0.8)'
        }
      }
    }
  };

  return (
    <div className="bg-transparent border border-primary-200 dark:border-primary-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-primary-900 dark:text-primary-100">Season Game Log</h3>
      
      {/* Season selector */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {seasons.map((season) => (
          <button
            key={season}
            onClick={() => setSelectedSeason(season)}
            className={`px-3 py-1 rounded font-semibold transition-colors duration-150 border border-primary-300 dark:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 ${
              selectedSeason === season 
                ? 'bg-primary-600 text-white dark:bg-primary-400 dark:text-primary-900' 
                : 'bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-100 hover:bg-primary-200 dark:hover:bg-primary-700'
            }`}
          >
            {season}
          </button>
        ))}
      </div>

      {/* Stat type selector */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {Object.keys(statOptions).map((stat) => (
          <button
            key={stat}
            onClick={() => setStatType(stat)}
            className={`px-3 py-1 rounded font-semibold transition-colors duration-150 border border-primary-300 dark:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 ${
              statType === stat 
                ? 'bg-primary-600 text-white dark:bg-primary-400 dark:text-primary-900' 
                : 'bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-100 hover:bg-primary-200 dark:hover:bg-primary-700'
            }`}
          >
            {statOptions[stat].label}
          </button>
        ))}
      </div>

      <div style={{ height: '300px' }}>
        <Line data={lineChartData} options={lineOptions} />
      </div>
    </div>
  );
} 