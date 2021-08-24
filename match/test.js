const { getOversText, getStrikeRate, getEconomy, getRunRate } = require('./utils')

const obj1 = {
    batStats: {
        balls: 6,
        runs: 100
    }
}

const obj2 = {
    batStats: {
        balls: 30,
        runs: 67
    }

}

const obj3 = {
    batStats: {
        balls: 6,
        runs: 7
    }
}

console.log(getRunRate(obj1))
console.log(getRunRate(obj2))
console.log(getRunRate(obj3))