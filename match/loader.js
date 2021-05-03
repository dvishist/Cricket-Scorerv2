const fs = require("fs")

//function to convert array of names to player objects with initialised values
const mapTeamToObjects = team =>
    team.map(playerName => {
        return {
            name: playerName.replace('#C', '').replace('#WK', ''),
            captain: playerName.includes('#C'),
            wk: playerName.includes('#WK'),
            batStats: {
                balls: 0,
                runs: 0,
                fours: 0,
                sixes: 0,
                dots: 0,
                getStrikeRate() {
                    return (this.runs / this.balls * 100).toPrecision(5)
                }
                // ones: 0,
                // twos: 0,
                // threes:0
            },
            bowlStats: {
                balls: 0,
                runs: 0,
                wides: 0,
                noBalls: 0,
                getEconomy() {
                    return (this.runs / this.balls * 6).toPrecision(3)
                }
            },
            fieldStats: {
                catches: 0,
                runOuts: 0
            },
            wicket: {
                out: false,
                method: '',
                bowler: null,
                fielder: null
            }
        }
    })

const loadTeams = function () {
    //load team csv files as array

    const team1String = fs.readFileSync('./match/teams/team1.csv', 'utf8')
    const team1Array = team1String.split('\r\n').slice(0, 12)

    const team2String = fs.readFileSync('./match/teams/team2.csv', 'utf8')
    const team2Array = team2String.split('\r\n').slice(0, 12)


    //convert array of names to player objects with initialised values
    team1 = mapTeamToObjects(team1Array)
    team2 = mapTeamToObjects(team2Array)
    return { team1, team2 }
}()

module.exports = loadTeams
