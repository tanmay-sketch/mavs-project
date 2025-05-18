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

    // console.log('Name to ID mapping:', nameToId);

    // Group season logs by player name (since that's what we have in the logs)
    const playerSeasonLogs = Object.values(players.seasonLogs).reduce((acc, season) => {
        const playerName = season.age;
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

async function getFullSeasonAverages(players, playerId) {
    // Find the player's name from their ID
    const player = Object.values(players.bio).find(p => p.playerId === playerId);
    if (!player) {
        console.log('Player not found:', playerId);
        return null;
    }
    const playerName = `${player.firstName} ${player.lastName}`;

    // Get only this player's season logs
    const playerSeasons = Object.values(players.seasonLogs)
        .filter(season => season.age === playerName);

    if (playerSeasons.length === 0) {
        console.log('No season logs found for player:', playerName);
        return null;
    }

    // Calculate averages for the specific player
    const totalStats = playerSeasons.reduce((sum, season) => ({
        // Shooting stats
        fgm: sum.fgm + Number(season.FGM || 0),
        fga: sum.fga + Number(season.FGA || 0),
        fgPercent: sum.fgPercent + Number(season['FG%'] || 0),
        threePm: sum.threePm + Number(season['3PM'] || 0),
        threePa: sum.threePa + Number(season['3PA'] || 0),
        threePercent: sum.threePercent + Number(season['3P%'] || 0),
        ft: sum.ft + Number(season.FT || 0),
        fta: sum.fta + Number(season.FTA || 0),
        ftPercent: sum.ftPercent + Number(season.FTP || 0),
        
        // Rebounds
        orb: sum.orb + Number(season.ORB || 0),
        drb: sum.drb + Number(season.DRB || 0),
        trb: sum.trb + Number(season.TRB || 0),
        
        // Other stats
        ast: sum.ast + Number(season.AST || 0),
        stl: sum.stl + Number(season.STL || 0),
        blk: sum.blk + Number(season.BLK || 0),
        tov: sum.tov + Number(season.TOV || 0),
        pf: sum.pf + Number(season.PF || 0),
        pts: sum.pts + Number(season.PTS || 0),
        
        // Playing time
        gp: sum.gp + Number(season.GP || 0),
        gs: sum.gs + Number(season.GS || 0),
        mp: sum.mp + Number(season.MP || 0)
    }), {
        fgm: 0, fga: 0, fgPercent: 0,
        threePm: 0, threePa: 0, threePercent: 0,
        ft: 0, fta: 0, ftPercent: 0,
        orb: 0, drb: 0, trb: 0,
        ast: 0, stl: 0, blk: 0,
        tov: 0, pf: 0, pts: 0,
        gp: 0, gs: 0, mp: 0
    });

    const numSeasons = playerSeasons.length;
    const lastSeason = playerSeasons[playerSeasons.length - 1];

    return {
        // Shooting averages
        fgm: Number((totalStats.fgm / numSeasons).toFixed(1)),
        fga: Number((totalStats.fga / numSeasons).toFixed(1)),
        fgPercent: Number((totalStats.fgPercent / numSeasons).toFixed(1)),
        threePm: Number((totalStats.threePm / numSeasons).toFixed(1)),
        threePa: Number((totalStats.threePa / numSeasons).toFixed(1)),
        threePercent: Number((totalStats.threePercent / numSeasons).toFixed(1)),
        ft: Number((totalStats.ft / numSeasons).toFixed(1)),
        fta: Number((totalStats.fta / numSeasons).toFixed(1)),
        ftPercent: Number((totalStats.ftPercent / numSeasons).toFixed(1)),
        
        // Rebound averages
        orb: Number((totalStats.orb / numSeasons).toFixed(1)),
        drb: Number((totalStats.drb / numSeasons).toFixed(1)),
        trb: Number((totalStats.trb / numSeasons).toFixed(1)),
        
        // Other stat averages
        ast: Number((totalStats.ast / numSeasons).toFixed(1)),
        stl: Number((totalStats.stl / numSeasons).toFixed(1)),
        blk: Number((totalStats.blk / numSeasons).toFixed(1)),
        tov: Number((totalStats.tov / numSeasons).toFixed(1)),
        pf: Number((totalStats.pf / numSeasons).toFixed(1)),
        pts: Number((totalStats.pts / numSeasons).toFixed(1)),
        
        // Playing time averages
        gp: Math.round(totalStats.gp / numSeasons),
        gs: Math.round(totalStats.gs / numSeasons),
        mp: Number((totalStats.mp / numSeasons).toFixed(1)),
        
        // Additional calculated stats
        gamesPlayed: totalStats.gp,
        gamesStarted: totalStats.gs,
        
        // Season information
        lastSeason: lastSeason.Season,
        lastTeam: lastSeason.Team,
        lastLeague: lastSeason.League
    };
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
        
        return {
            ...bioData[id],
            ...rankings[id],
            ...measurements[id],
            ...stats
        };
    });

    return formattedPlayers;
}

// Export the raw player data and getFullSeasonAverages function
export { getFullSeasonAverages, playerData };
export default loadPlayerData;