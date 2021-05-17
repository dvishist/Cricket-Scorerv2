const { getOversText, getStrikeRate, getEconomy, getRunRate } = require('./utils')

console.log(getRunRate({
    batStats: {
        runs: 22,
        balls: 5
    }
}))