import React, { useEffect, useState, useRef, useCallback, Suspense, lazy } from 'react';
import { loadPlayerData } from '../utils/loadPlayerData';

// Lazy load components
const SearchAndFilter = lazy(() => import('./SearchAndFilter'));
const PlayerCard = lazy(() => import('./PlayerCard'));

// Loading fallback component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-700" />
  </div>
);

// Board component that displays the big draft board
export default function Board() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [visiblePlayers, setVisiblePlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(null);
  const PLAYERS_PER_PAGE = 12;

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await loadPlayerData(sortBy);
        setAllPlayers(data);
        setVisiblePlayers([]);
        setHasMore(true);
      } catch (error) {
        console.error('Error loading player data:', error);
      }
      setLoading(false);
    };
    loadData();
  }, [sortBy]);

  // Load more players when scrolling
  const loadMorePlayers = useCallback(() => {
    if (!loading && hasMore) {
      const start = visiblePlayers.length;
      const filtered = allPlayers
        .filter(player => player.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(start, start + PLAYERS_PER_PAGE);

      if (filtered.length === 0) {
        setHasMore(false);
        return;
      }

      setVisiblePlayers(prev => [...prev, ...filtered]);
    }
  }, [loading, hasMore, visiblePlayers.length, allPlayers, searchQuery]);

  // Handle search
  useEffect(() => {
    if (searchQuery !== '') {
      setVisiblePlayers([]);
      setHasMore(true);
      const filtered = allPlayers
        .filter(player => player.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, PLAYERS_PER_PAGE);
      
      setVisiblePlayers(filtered);
      setHasMore(filtered.length === PLAYERS_PER_PAGE);
    } else {
      setVisiblePlayers(allPlayers.slice(0, PLAYERS_PER_PAGE));
      setHasMore(allPlayers.length > PLAYERS_PER_PAGE);
    }
  }, [searchQuery, allPlayers]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePlayers();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [loadMorePlayers, hasMore, loading]);

  // Get total count for filter stats
  const totalFilteredCount = allPlayers.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).length;

  return (
    <div className="pt-16 bg-gray-100 dark:bg-primary-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalPlayers={allPlayers.length}
            filteredCount={totalFilteredCount}
          />
        </Suspense>
        
        {loading && visiblePlayers.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Suspense fallback={<LoadingSpinner />}>
                {visiblePlayers.map(player => (
                  <PlayerCard key={player.playerId} player={player} />
                ))}
              </Suspense>
            </div>
            
            {hasMore && (
              <div ref={loadingRef}>
                <LoadingSpinner />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 