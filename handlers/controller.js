let matchState

//ball types
const ballRadio = document.getElementById("ball")
const noBallRadio = document.getElementById("noBall")
const wideRadio = document.getElementById("wide")

//runs types
const runsRadio = document.getElementById("runs")
const byesRadio = document.getElementById("byes")
const legByesRadio = document.getElementById("legByes")
const penaltiesRadio = document.getElementById("penalties")

document.getElementById("dotButton").addEventListener('click', () => { playBall(0, false) })
document.getElementById("oneButton").addEventListener('click', () => { playBall(1, false) })
document.getElementById("twoButton").addEventListener('click', () => { playBall(2, false) })
document.getElementById("threeButton").addEventListener('click', () => { playBall(3, false) })
document.getElementById("fourButton").addEventListener('click', () => { playBall(4, true) })
document.getElementById("fiveButton").addEventListener('click', () => { playBall(5, false) })
document.getElementById("sixButton").addEventListener('click', () => { playBall(6, true) })

const changeStrikeButton = document.getElementById("changeStrikeButton")

ipcRenderer.on('controller-setup', (e, match) => {
    matchState = match
    matchState.live = {}
    matchState.live.batsman1 = matchState.battingTeam.playerList[0]
    matchState.live.batsman2 = matchState.battingTeam.playerList[1]
    matchState.live.striker = matchState.live.batsman1
    matchState.live.bowler = matchState.bowlingTeam.playerList[10]
})

const playBall = (runs, boundary) => {
    //check penalty
    if (penaltiesRadio.checked) {
        matchState.battingTeam.batStats.runs += runs
        matchState.bowlingTeam.extras.penalties += runs
        ipcRenderer.send('update-main', matchState)
        return
    }

    //check ball type
    if (ballRadio.checked) {
        matchState.battingTeam.batStats.balls++
        matchState.live.bowler.bowlStats.balls++
        matchState.live.striker.batStats.balls++
    } else if (noBallRadio.checked) {
        matchState.bowlingTeam.extras.noBalls++
        matchState.live.bowler.bowlStats.noBalls++
        matchState.live.bowler.bowlStats.runs++
        matchState.battingTeam.batStats.runs++
    } else if (wideRadio.checked) {
        matchState.bowlingTeam.extras.wides++
        matchState.live.bowler.bowlStats.wides++
        matchState.live.bowler.bowlStats.runs++
        matchState.battingTeam.batStats.runs++
    }

    //check bat type
    matchState.battingTeam.batStats.runs += runs
    if (runsRadio.checked) {
        matchState.live.striker.batStats.runs += runs
        matchState.live.bowler.bowlStats.runs += runs
        if (boundary) {
            if (runs === 4) {
                matchState.battingTeam.batStats.fours++
                matchState.live.striker.batStats.fours++
            } else {
                matchState.battingTeam.batStats.sixes++
                matchState.live.striker.batStats.sixes++
            }
        }
    } else if (byesRadio.checked) {
        matchState.bowlingTeam.extras.byes += runs
    } else if (legByesRadio.checked) {
        matchState.bowlingTeam.extras.legByes += runs
    }

    ipcRenderer.send('update-main', matchState)
}

const changeStrike = document.getElementById('changeStrikeButton')
changeStrike.addEventListener('click', () => {
    let state = matchState.live
    state.striker = state.striker === state.batsman1 ? state.batsman2 : state.batsman1
    ipcRenderer.send('update-players', matchState.live)
})
