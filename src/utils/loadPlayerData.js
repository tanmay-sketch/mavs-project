import playerData from '../data/project_data.json';

function getBioData(players) {
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
    return Object.entries(players.scoutRankings).reduce((acc, [id, ranking]) => {
        acc[id] = {
            rank: ranking['ESPN Rank'] || 'N/A'
        };
        return acc;
    }, {});
}

function getMeasurements(players) {
    return Object.entries(players.measurements).reduce((acc, [id, measurement]) => {
        acc[id] = {
            heightNoShoes: measurement.heightNoShoes,
            weight: measurement.weight
        };
        return acc;
    }, {});
}

function getSeasonAverages(players) {
    // Create a mapping of player names to IDs from bio data
    const nameToId = players.bio.reduce((acc, player) => {
        acc[`${player.firstName} ${player.lastName}`] = player.playerId;
        return acc;
    }, {});

    console.log('Name to ID mapping:', nameToId);

    // Group season logs by player name (since that's what we have in the logs)
    const playerSeasonLogs = Object.values(players.seasonLogs).reduce((acc, season) => {
        const playerName = season.age; // The 'age' field actually contains the player name
        if (!acc[playerName]) {
            acc[playerName] = [];
        }
        acc[playerName].push(season);
        return acc;
    }, {});

    console.log('Grouped season logs by name:', playerSeasonLogs);

    // Calculate averages for each player
    const averages = Object.entries(playerSeasonLogs).reduce((acc, [playerName, seasons]) => {
        const playerId = nameToId[playerName];
        if (!playerId) {
            console.log('No matching ID found for player:', playerName);
            return acc;
        }

        if (seasons.length > 0) {
            const totalStats = seasons.reduce((sum, season) => ({
                pts: sum.pts + Number(season.PTS || 0),
                ast: sum.ast + Number(season.AST || 0),
                reb: sum.reb + Number(season.TRB || 0),
                blk: sum.blk + Number(season.BLK || 0),
                stl: sum.stl + Number(season.STL || 0)
            }), { pts: 0, ast: 0, reb: 0, blk: 0, stl: 0 });

            acc[playerId] = {
                pts: Number((totalStats.pts / seasons.length).toFixed(1)),
                ast: Number((totalStats.ast / seasons.length).toFixed(1)),
                reb: Number((totalStats.reb / seasons.length).toFixed(1)),
                blk: Number((totalStats.blk / seasons.length).toFixed(1)),
                stl: Number((totalStats.stl / seasons.length).toFixed(1))
            };
        }

        return acc;
    }, {});

    console.log('Final averages:', averages);
    return averages;
}

async function loadPlayerData() {
    const bioData = getBioData(playerData);
    const rankings = getScoutRankings(playerData);
    const measurements = getMeasurements(playerData);
    const seasonAverages = getSeasonAverages(playerData);

    // Combine all data
    const formattedPlayers = Object.keys(bioData).map(id => {
        const playerId = bioData[id].playerId;
        const stats = seasonAverages[playerId] || { pts: 0, ast: 0, reb: 0, blk: 0, stl: 0 };
        console.log(`Player ${bioData[id].name} (ID: ${playerId}) stats:`, stats);
        
        return {
            ...bioData[id],
            ...rankings[id],
            ...measurements[id],
            ...stats
        };
    });

    console.log('Sample player data:', formattedPlayers[0]);
    return formattedPlayers;
}

export default loadPlayerData;