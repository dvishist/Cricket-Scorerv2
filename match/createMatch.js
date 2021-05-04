const createMatch = function (team1, team2, toss, decision, overs) {
    let battingTeam, bowlingTeam
    if ((toss == team1 && decision == 'bat') || (toss == team2 && decision == 'bowl')) {
        battingTeam = team1
        bowlingTeam = team2
    }
    else {
        battingTeam = team2
        bowlingTeam = team1
    }
    return {
        innings: 1,
        overs,
        toss,
        decision,
        battingTeam,
        bowlingTeam,
        target: null
    }
}

module.exports = createMatch
