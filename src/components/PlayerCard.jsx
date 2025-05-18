import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';

export default function PlayerCard({ player }) {
  const navigate = useNavigate();
  
  console.log('PlayerCard received player:', player); // Log the player data received by the card
  
  // Helper to convert inches to feet/inches
  const formatHeight = (inches) => {
    const ft = Math.floor(inches / 12);
    const inch = inches % 12;
    return `${ft}'${inch}"`;
  };
  
  const handleClick = () => {
    navigate(`/player/${player.playerId}`, { state: { player } });
  };
  
  return (
    <Card 
      variant="outlined" 
      className="relative max-w-xs w-full mx-auto shadow-sm bg-transparent dark:border-primary-700 cursor-pointer hover:border-primary-500 transition-colors duration-200"
      onClick={handleClick}
    >
      {/* ESPN Rank Badge */}
      {player.rank && (
        <div className="absolute top-3 left-3 bg-primary-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg">
          #{player.rank}
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar */}
          <Avatar 
            src={player.photoUrl} 
            alt={player.name} 
            sx={{ width: 96, height: 96 }}
            className="ring-2 ring-primary-200 dark:ring-primary-700"
          >
            <SportsBasketballIcon sx={{ fontSize: 48 }} />
          </Avatar>
          
          {/* Name and Team */}
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-primary-900 dark:text-primary-100">
              {player.name}
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-300">
              {player.currentTeam}
            </p>
          </div>
          
          {/* Physical Info */}
          <div className="flex justify-center space-x-4 text-sm text-secondary-600 dark:text-secondary-300">
            <span className="font-medium">Height: {formatHeight(player.height)}</span>
            <span className="font-medium">Weight: {player.weight} lbs</span>
          </div>
          
          {/* Divider */}
          <div className="w-full border-t border-primary-200 dark:border-primary-700" />
          
          {/* Stats in one line */}
          <div className="grid grid-cols-5 w-full gap-2">
            {[
              { label: 'PTS', value: player.pts },
              { label: 'REB', value: player.reb },
              { label: 'AST', value: player.ast },
              { label: 'BLK', value: player.blk },
              { label: 'STL', value: player.stl }
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center"
              >
                <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400">
                  {stat.label}
                </span>
                <span className="font-bold text-primary-800 dark:text-primary-200">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}