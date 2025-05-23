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
    // Create a mapping of rankings by playerId
    return players.scoutRankings.reduce((acc, ranking) => {
        acc[ranking.playerId] = {
            ...ranking,
            rank: ranking['ESPN Rank'] || 999999 // Use ESPN Rank as the default rank
        };
        return acc;
    }, {});
}

function getScoutingReports(players) {
    // Create a mapping of reports by playerId
    return players.scoutingReports.reduce((acc, report) => {
        if (!acc[report.playerId]) {
            acc[report.playerId] = [];
        }
        acc[report.playerId].push(report);
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

    // Group season logs by player name (since that's what we have in the logs)
    const playerSeasonLogs = Object.values(players.seasonLogs).reduce((acc, season) => {
        const playerName = season.age;
        if (!acc[playerName]) {
            acc[playerName] = [];
        }
        acc[playerName].push(season);
        return acc;
    }, {});

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

    return averages;
}

async function loadPlayerData(sortBy = 'rank') {
    const bioData = getBioData(playerData);
    const rankings = getScoutRankings(playerData);
    const scoutingReports = getScoutingReports(playerData);
    const measurements = getMeasurements(playerData);
    const seasonAverages = getSeasonAverages(playerData);

    // Combine all data
    const formattedPlayers = Object.keys(bioData).map(id => {
        const playerId = bioData[id].playerId;
        const stats = seasonAverages[playerId] || { pts: 0, ast: 0, reb: 0, blk: 0, stl: 0 };
        const ranking = rankings[playerId] || { rank: 999999 }; // Use high number for unranked players
        
        return {
            ...bioData[id],
            ...ranking,
            scoutingReports: scoutingReports[playerId] || [],
            ...measurements[id],
            ...stats
        };
    });

    // Sort players by the specified stat (default to rank)
    return formattedPlayers.sort((a, b) => {
        if (sortBy === 'rank') {
            // For rank, lower is better, so we sort ascending
            const rankA = a.rank || 999999;
            const rankB = b.rank || 999999;
            if (rankA === rankB) {
                return a.name.localeCompare(b.name);
            }
            return rankA - rankB;
        } else {
            // For other stats, higher is better, so we sort descending
            const valA = b[sortBy] || 0;
            const valB = a[sortBy] || 0;
            if (valA === valB) {
                return a.name.localeCompare(b.name);
            }
            return valA - valB;
        }
    });
}

// Helper function to get all available stats for a player
function getPlayerStats(playerId) {
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

    // Calculate season averages
    const lastSeason = seasonLogs[seasonLogs.length - 1];
    const numSeasons = seasonLogs.length;

    const totalStats = seasonLogs.reduce((sum, season) => ({
        fgm: sum.fgm + Number(season.FGM || 0),
        fga: sum.fga + Number(season.FGA || 0),
        threePm: sum.threePm + Number(season['3PM'] || 0),
        threePa: sum.threePa + Number(season['3PA'] || 0),
        ft: sum.ft + Number(season.FT || 0),
        fta: sum.fta + Number(season.FTA || 0),
        orb: sum.orb + Number(season.ORB || 0),
        drb: sum.drb + Number(season.DRB || 0),
        trb: sum.trb + Number(season.TRB || 0),
        ast: sum.ast + Number(season.AST || 0),
        stl: sum.stl + Number(season.STL || 0),
        blk: sum.blk + Number(season.BLK || 0),
        tov: sum.tov + Number(season.TOV || 0),
        pf: sum.pf + Number(season.PF || 0),
        pts: sum.pts + Number(season.PTS || 0),
        gp: sum.gp + Number(season.GP || 0),
        gs: sum.gs + Number(season.GS || 0),
        mp: sum.mp + Number(season.MP || 0)
    }), {
        fgm: 0, fga: 0, threePm: 0, threePa: 0,
        ft: 0, fta: 0, orb: 0, drb: 0, trb: 0,
        ast: 0, stl: 0, blk: 0, tov: 0, pf: 0,
        pts: 0, gp: 0, gs: 0, mp: 0
    });

    return {
        seasonAverages: {
            fgm: Number((totalStats.fgm / numSeasons).toFixed(1)),
            fga: Number((totalStats.fga / numSeasons).toFixed(1)),
            fgPercent: Number((totalStats.fgm / totalStats.fga * 100).toFixed(1)),
            threePm: Number((totalStats.threePm / numSeasons).toFixed(1)),
            threePa: Number((totalStats.threePa / numSeasons).toFixed(1)),
            threePercent: Number((totalStats.threePm / totalStats.threePa * 100).toFixed(1)),
            ft: Number((totalStats.ft / numSeasons).toFixed(1)),
            fta: Number((totalStats.fta / numSeasons).toFixed(1)),
            ftPercent: Number((totalStats.ft / totalStats.fta * 100).toFixed(1)),
            orb: Number((totalStats.orb / numSeasons).toFixed(1)),
            drb: Number((totalStats.drb / numSeasons).toFixed(1)),
            trb: Number((totalStats.trb / numSeasons).toFixed(1)),
            ast: Number((totalStats.ast / numSeasons).toFixed(1)),
            stl: Number((totalStats.stl / numSeasons).toFixed(1)),
            blk: Number((totalStats.blk / numSeasons).toFixed(1)),
            tov: Number((totalStats.tov / numSeasons).toFixed(1)),
            pf: Number((totalStats.pf / numSeasons).toFixed(1)),
            pts: Number((totalStats.pts / numSeasons).toFixed(1)),
            gp: Math.round(totalStats.gp / numSeasons),
            gs: Math.round(totalStats.gs / numSeasons),
            mp: Number((totalStats.mp / numSeasons).toFixed(1)),
            gamesPlayed: totalStats.gp,
            gamesStarted: totalStats.gs,
            lastSeason: lastSeason.Season,
            lastTeam: lastSeason.Team,
            lastLeague: lastSeason.League
        },
        logsBySeason
    };
}

// Export the functions and data
export { loadPlayerData, getPlayerStats, playerData };