const fs = require('fs')
const Player = require('./models/Player')
const Team = require('./models/Team')

//function to convert array of names to player objects with initialised values
const mapTeamToObjects = team =>
    team.map(playerName => {
        return new Player(playerName)
    })

const loadTeams = function () {
    //load team csv files as array

    const team1String = fs.readFileSync('./teams/team1.csv', 'utf8')
    const team1Array = team1String.split('\r\n').slice(0, 15).map(str => str.split(',')[1])
    const team1Name = team1Array[0]
    const team1Short = team1Array[1]
    team1Array.splice(0, 3)

    const team2String = fs.readFileSync('./teams/team2.csv', 'utf8')
    const team2Array = team2String.split('\r\n').slice(0, 15).map(str => str.split(',')[1])
    const team2Name = team2Array[0]
    const team2Short = team2Array[1]
    team2Array.splice(0, 3)

    //convert array of names to player objects with initialised values
    team1 = mapTeamToObjects(team1Array)
    team2 = mapTeamToObjects(team2Array)

    //convert array of players to team objects

    const team1Obj = new Team(team1Name, team1Short, team1)
    const team2Obj = new Team(team2Name, team2Short, team2)
    return { team1Obj, team2Obj }
}()

module.exports = loadTeams
