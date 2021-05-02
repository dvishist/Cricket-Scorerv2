const csv = require("csv-parser")
const fs = require("fs")
const team1 = [], team2 = []


const loadTeams = function () {
    fs.createReadStream('./match/teams/team1.csv')
        .pipe(csv())
        .on('data', row => team1.push(row))
        .on('end', () => console.log(team1))

    fs.createReadStream('./match/teams/team2.csv')
        .pipe(csv())
        .on('data', row => team2.push(row))
        .on('end', () => console.log(team2))
}()

module.exports = loadTeams