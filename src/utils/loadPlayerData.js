import playerData from '../data/project_data.json';

function getBioData(players) {
    return Object.entries(players.bio).reduce((acc, [id, player]) => {
        acc[id] = {
            playerId: id,
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

async function loadPlayerData() {
    const bioData = getBioData(playerData);
    const rankings = getScoutRankings(playerData);
    const measurements = getMeasurements(playerData);

    // Combine all data and add default stats
    const formattedPlayers = Object.keys(bioData).map(id => ({
        ...bioData[id],
        ...rankings[id],
        ...measurements[id],
        pts: 1.0,
        ast: 1.0,
        stl: 1.0,
        reb: 1.0,
        blk: 1.0
    }));

    return formattedPlayers;
}

export default loadPlayerData;