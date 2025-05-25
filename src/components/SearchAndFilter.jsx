import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import CloseIcon from '@mui/icons-material/Close';

const sortOptions = [
  { value: 'rank', label: 'Rank' },
  { value: 'pts', label: 'Points' },
  { value: 'reb', label: 'Rebounds' },
  { value: 'ast', label: 'Assists' },
  { value: 'blk', label: 'Blocks' },
  { value: 'stl', label: 'Steals' },
  { value: 'fgPercent', label: 'FG%' },
  { value: 'threePercent', label: '3P%' },
  { value: 'ftPercent', label: 'FT%' },
  { value: 'gamesPlayed', label: 'Games Played' }
];

export default function SearchAndFilter({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange,
  totalPlayers,
  filteredCount 
}) {
  return (
    <div className="p-6 mb-6 rounded-lg bg-white dark:bg-primary-900 border border-solid border-primary-500/50 dark:border-primary-300/50 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-900 dark:text-primary-100" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search players..."
            className="w-full pl-10 h-11 rounded-lg bg-primary-50 dark:bg-primary-800
              text-primary-900 dark:text-primary-100
              placeholder:text-primary-400 dark:placeholder:text-primary-500
              focus:outline-none focus:ring-2 focus:ring-primary-500
              pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full
                hover:bg-primary-200 dark:hover:bg-primary-700
                text-primary-500 dark:text-primary-400
                transition-colors duration-200"
              aria-label="Clear search"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-48">
          <div className="relative flex items-center">
            <SwapVertIcon className="absolute left-3 h-4 w-4 pointer-events-none text-primary-900 dark:text-primary-100" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full pl-10 h-11 rounded-lg appearance-none cursor-pointer
                bg-primary-50 dark:bg-primary-800
                text-primary-900 dark:text-primary-100
                border border-primary-200 dark:border-primary-700
                focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="mt-4 text-sm text-primary-600 dark:text-primary-300">
        Showing <span className="font-medium text-primary-900 dark:text-primary-100">{filteredCount}</span> of{" "}
        <span className="font-medium text-primary-900 dark:text-primary-100">{totalPlayers}</span> players
        {searchQuery && (
          <span className="ml-2">
            for <span className="font-medium text-primary-500">{`"${searchQuery}"`}</span>
          </span>
        )}
      </div>
    </div>
  );
} 