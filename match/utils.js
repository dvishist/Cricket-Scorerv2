const getOversText = balls => (Math.trunc(balls / 6) + '.' + (balls % 6)).replace('.0', '')

const getStrikeRate = player => (player.batStats.runs / player.batStats.balls * 100).toPrecision(5)

const getEconomy = player => (player.bowlStats.runs / player.bowlStats.balls * 6).toPrecision(3)

const getRunRate = team => (team.batStats.runs / team.batStats.balls * 6).toPrecision(3)

module.exports = { getOversText, getStrikeRate, getEconomy, getRunRate }