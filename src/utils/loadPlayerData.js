import playerData from '../data/project_data.json';

function getBioData(players) {
/*
    Get bio data for each player function
    Args:
        players: The player data from the json file
    Returns:
        A mapping of playerId to player data

    Used in loadPlayerData function in src/utils/loadPlayerData.js
*/
    return Object.entries(players.bio).reduce((acc, [id, player]) => {
        acc[id] = {
            playerId: player.playerId,
            name: `${player.firstName} ${player.lastName}`,
            height: player.height,
            weight: player.weight,
            photoUrl: player.photoUrl,
            currentTeam: player.currentTeam
        };
        return acc;
    }, {});
}

function getScoutRankings(players) {
/*
    Get scout rankings for each player function
    Args:
        players: The player data from the json file
    Returns:
        A mapping of playerId to scout rankings

    Used in loadPlayerData function in src/utils/loadPlayerData.js
*/
    return players.scoutRankings.reduce((acc, ranking) => {
        acc[ranking.playerId] = {
            ...ranking,
            rank: ranking['ESPN Rank'] || 999999 
        };
        return acc;
    }, {});
}

function getScoutingReports(players) {
/*
    Get scouting reports for each player function
    Args:
        players: The player data from the json file
    Returns:
        A mapping of playerId to scouting reports

    Used in loadPlayerData function in src/utils/loadPlayerData.js
*/
    return players.scoutingReports.reduce((acc, report) => {
        if (!acc[report.playerId]) {
            acc[report.playerId] = [];
        }
        acc[report.playerId].push(report);
        return acc;
    }, {});
}

function getMeasurements(players) {
/*
    Get measurements for each player function
    Args:
        players: The player data from the json file
    Returns:
        A mapping of playerId to measurements

    Used in loadPlayerData function in src/utils/loadPlayerData.js
*/
    return Object.entries(players.measurements).reduce((acc, [id, measurement]) => {
        acc[id] = {
            heightNoShoes: measurement.heightNoShoes,
            weight: measurement.weight
        };
        return acc;
    }, {});
}

function calculateAverages(seasons) {
/*
    Calculate averages for each player function
    Args:
        seasons: The seasons data from the json file
    Returns:
        A mapping of playerId to averages

    Used in getSeasonAverages function in src/utils/loadPlayerData.js
*/
    const statsMapping = {
        'PTS': 'pts',
        'AST': 'ast',
        'TRB': 'reb',  // Map TRB to 'reb'
        'BLK': 'blk',
        'STL': 'stl'
    };
    
    if (seasons.length === 0) return null;

    const totals = seasons.reduce((sum, season) => {
        Object.entries(statsMapping).forEach(([statKey, propName]) => {
            sum[propName] = (sum[propName] || 0) + Number(season[statKey] || 0);
        });
        return sum;
    }, {});

    return Object.entries(totals).reduce((avg, [stat, total]) => {
        avg[stat] = Number((total / seasons.length).toFixed(1));
        return avg;
    }, {});
}

function getSeasonAverages(players) {
/*
    Get season averages for each player function
    Args:
        players: The player data from the json file
    Returns:
        A mapping of playerId to season averages

    Used in loadPlayerData function in src/utils/loadPlayerData.js
*/
    // Create player name to ID mapping
    const nameToId = players.bio.reduce((acc, player) => {
        acc[`${player.firstName} ${player.lastName}`] = player.playerId;
        return acc;
    }, {});

    // Group and calculate averages in one pass
    return Object.values(players.seasonLogs).reduce((acc, season) => {
        const playerName = season.age; // Player name stored in age field
        const playerId = nameToId[playerName];
        
        if (!playerId) return acc;
        
        if (!acc[playerId]) {
            acc[playerId] = calculateAverages([season]) || {
                pts: 0,
                ast: 0,
                reb: 0,
                blk: 0,
                stl: 0
            };
        } else {
            const newAverages = calculateAverages(
                Object.values(players.seasonLogs).filter(s => s.age === playerName)
            );
            if (newAverages) {
                acc[playerId] = newAverages;
            }
        }
        
        return acc;
    }, {});
}

function calculateDetailedStats(seasons) {
/* 
    Calculate detailed stats for each player function
    Args:
        seasons: The seasons data from the json file
    Returns:
        A mapping of playerId to detailed stats

    Used in getPlayerStats function in src/utils/loadPlayerData.js
*/
    if (seasons.length === 0) return null;

    const statFields = {
        basic: ['FGM', 'FGA', '3PM', '3PA', 'FT', 'FTA', 'ORB', 'DRB', 'TRB', 
                'AST', 'STL', 'BLK', 'TOV', 'PF', 'PTS', 'GP', 'GS', 'MP'],
        calculated: [
            { name: 'fgPercent', calc: (stats) => (stats.FGM / stats.FGA * 100) },
            { name: 'threePercent', calc: (stats) => (stats['3PM'] / stats['3PA'] * 100) },
            { name: 'ftPercent', calc: (stats) => (stats.FT / stats.FTA * 100) }
        ]
    };

    // Calculate totals in one pass
    const totals = seasons.reduce((sum, season) => {
        statFields.basic.forEach(field => {
            sum[field] = (sum[field] || 0) + Number(season[field] || 0);
        });
        return sum;
    }, {});

    // Calculate averages and percentages
    const averages = statFields.basic.reduce((avg, field) => {
        avg[field.toLowerCase()] = Number((totals[field] / seasons.length).toFixed(1));
        return avg;
    }, {});

    // Add calculated percentages
    statFields.calculated.forEach(({ name, calc }) => {
        averages[name] = Number(calc(totals).toFixed(1));
    });

    const lastSeason = seasons[seasons.length - 1];
    return {
        seasonAverages: {
            ...averages,
            gamesPlayed: totals.GP,
            gamesStarted: totals.GS,
            lastSeason: lastSeason.Season,
            lastTeam: lastSeason.Team,
            lastLeague: lastSeason.League
        }
    };
}

function getPlayerStats(playerId) {
/*
    Get player stats for a given playerId function
    Args:
        playerId: The playerId to get stats for
    Returns:
        A mapping of playerId to detailed stats

    Used in src/components/PlayerProfile.jsx
*/
    const player = playerData.bio.find(p => p.playerId === playerId);
    if (!player) return null;

    const playerName = `${player.firstName} ${player.lastName}`;
    const seasonLogs = Object.values(playerData.seasonLogs)
        .filter(log => log.age === playerName);

    if (seasonLogs.length === 0) return null;

    // Group logs by season
    const logsBySeason = seasonLogs.reduce((acc, log) => {
        const season = log.Season;
        if (!acc[season]) acc[season] = [];
        acc[season].push(log);
        return acc;
    }, {});

    return {
        ...calculateDetailedStats(seasonLogs),
        logsBySeason
    };
}

async function loadPlayerData(sortBy = 'rank') {
/*
    Load player data function
    Args:
        sortBy: The stat to sort by (default is 'rank')
    Returns:
        A sorted array of players

    Used in src/components/Board.jsx
*/
    const bioData = getBioData(playerData);
    const rankings = getScoutRankings(playerData);
    const scoutingReports = getScoutingReports(playerData);
    const measurements = getMeasurements(playerData);
    const seasonAverages = getSeasonAverages(playerData);

    // Combine all data
    const formattedPlayers = Object.keys(bioData).map(id => {
        const playerId = bioData[id].playerId;
        const stats = seasonAverages[playerId] || { 
            pts: 0, 
            ast: 0, 
            reb: 0, 
            blk: 0, 
            stl: 0 
        };
        const ranking = rankings[playerId] || { rank: 999999 };
        
        return {
            ...bioData[id],
            ...ranking,
            ...stats, // Spread stats directly into player object
            scoutingReports: scoutingReports[playerId] || [],
            ...measurements[id]
        };
    });

    // Sort players by the specified stat
    return formattedPlayers.sort((a, b) => {
        if (sortBy === 'rank') {
            const rankA = a.rank || 999999;
            const rankB = b.rank || 999999;
            if (rankA === rankB) {
                return a.name.localeCompare(b.name);
            }
            return rankA - rankB;
        } else {
            const valA = b[sortBy] || 0;
            const valB = a[sortBy] || 0;
            if (valA === valB) {
                return a.name.localeCompare(b.name);
            }
            return valA - valB;
        }
    });
}

// Export the functions and data
export { loadPlayerData, getPlayerStats, playerData };