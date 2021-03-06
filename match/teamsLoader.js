const fs = require('fs')
const Player = require('../models/Player')
const Team = require('../models/Team')

//function to convert array of names to player objects with initialised values
const mapTeamToObjects = team =>
    team.map(playerName => {
        return new Player(playerName)
    })

const loadTeams = function (team1FileName, team2FileName) {
    //load team csv files as array
    if (team1FileName.endsWith('.csv'))
        team1FileName = team1FileName.replace('.csv', '')
    if (team2FileName.endsWith('.csv'))
        team2FileName = team2FileName.replace('.csv', '')
    const team1String = fs.readFileSync('./teams/' + team1FileName + '.csv', 'utf8')
    const team1Array = team1String.split('\r\n').slice(0, 16).map(str => str.split(',')[1])
    const team1Name = team1Array[0]
    const team1Short = team1Array[1]
    const team1Logo = team1Array[2]
    team1Array.splice(0, 4)

    const team2String = fs.readFileSync('./teams/' + team2FileName + '.csv', 'utf8')
    const team2Array = team2String.split('\r\n').slice(0, 16).map(str => str.split(',')[1])
    const team2Name = team2Array[0]
    const team2Short = team2Array[1]
    const team2Logo = team2Array[2]
    team2Array.splice(0, 4)

    //convert array of names to player objects with initialised values
    team1 = mapTeamToObjects(team1Array)
    team2 = mapTeamToObjects(team2Array)

    //convert array of players to team objects

    const team1Obj = new Team(team1Name, team1Short, team1Logo, team1)
    const team2Obj = new Team(team2Name, team2Short, team2Logo, team2)
    return { team1Obj, team2Obj }
}

module.exports = loadTeams
