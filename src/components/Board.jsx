import React, { useEffect, useState, useRef, useCallback } from 'react';
import PlayerCard from './PlayerCard';
import SearchAndFilter from './SearchAndFilter';
import { loadPlayerData } from '../utils/loadPlayerData';

export default function Board() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [displayedPlayers, setDisplayedPlayers] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState('rank');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);
  const PLAYERS_PER_PAGE = 12;

  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true);
      try {
        const playerData = await loadPlayerData(sortBy);
        setPlayers(playerData);
        setFilteredPlayers(playerData);
        setDisplayedPlayers(playerData.slice(0, PLAYERS_PER_PAGE));
      } catch (error) {
        console.error('Error loading player data:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    loadData();
  }, [sortBy]);

  useEffect(() => {
    const filtered = players.filter(player =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlayers(filtered);
    setDisplayedPlayers(filtered.slice(0, PLAYERS_PER_PAGE));
    setPage(1);
  }, [searchQuery, players]);

  const loadMorePlayers = useCallback(async () => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const start = (nextPage - 1) * PLAYERS_PER_PAGE;
    const end = start + PLAYERS_PER_PAGE;
    
    // Simulate network delay for smooth loading animation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDisplayedPlayers(prev => [
      ...prev,
      ...filteredPlayers.slice(start, end)
    ]);
    setPage(nextPage);
    setIsLoadingMore(false);
  }, [page, filteredPlayers, isLoadingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && displayedPlayers.length < filteredPlayers.length) {
          loadMorePlayers();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadingRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMorePlayers, displayedPlayers.length, filteredPlayers.length]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="pt-16 bg-gray-100 dark:bg-primary-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalPlayers={players.length}
          filteredCount={filteredPlayers.length}
        />
        
        {initialLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-700"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedPlayers.map((player) => (
                <PlayerCard key={player.playerId} player={player} />
              ))}
            </div>
            
            {displayedPlayers.length < filteredPlayers.length && (
              <div 
                ref={loadingRef}
                className="flex justify-center items-center py-8"
              >
                {isLoadingMore && (
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-700"></div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 