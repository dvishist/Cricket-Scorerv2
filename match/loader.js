const csv = require("csv-parser")
const fs = require("fs")
const team1 = [], team2 = []
const Player = require('./Player')

fs.createReadStream('./match/teams/team1.csv')
    .pipe(csv())
    .on('data', row => team1.push(new Player(...Object.values(row))))
    .on('end', () => console.log(team1))
