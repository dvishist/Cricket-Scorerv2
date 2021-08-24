const getOversText = balls => (Math.trunc(balls / 6) + '.' + (balls % 6)).replace('.0', '')

const getStrikeRate = player => {
    let strikeRate = (player.batStats.runs / player.batStats.balls * 100)
    if (Number.isNaN(strikeRate)) return (0).toPrecision(3)
    if (strikeRate < 10) {
        strikeRate = strikeRate.toPrecision(3)
    } else if (strikeRate < 100) {
        strikeRate = strikeRate.toPrecision(4)
    } else if (strikeRate < 1000) {
        strikeRate = strikeRate.toPrecision(5)
    }
    return strikeRate
}

const getEconomy = player => (player.bowlStats.runs / player.bowlStats.balls * 6).toPrecision(3)

const getRunRate = team => {
    if (team.batStats.balls == 0) return (0).toPrecision(3)
    else {
        let runRate = team.batStats.runs / team.batStats.balls * 6
        if (runRate < 10) return runRate.toPrecision(3)
        else return runRate.toPrecision(4)
    }
}

const findPlayer = (team, playerName) => team.playerList.find(player => player.name === playerName)

const outMethods = {
    caught: 'c',
    stumped: 'st',
    runout: 'runout',
}

module.exports = { getOversText, getStrikeRate, getEconomy, getRunRate, findPlayer, outMethods }