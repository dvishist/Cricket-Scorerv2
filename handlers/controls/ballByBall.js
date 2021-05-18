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


const updateMain = () => {
    ballRadio.checked = true
    runsRadio.checked = true
    wicketFielder.selectedIndex = 0
    runoutFielder.selectedIndex = 0
    ipcRenderer.send('update-main', matchState)

    //update msg display by auto clicking the checked radio
    document.querySelector('[name="msg"]:checked').click()
}

// ball by ball buttons
Array.from(document.getElementsByClassName("valued")).forEach(btn => {
    btn.addEventListener('click', () => {
        playBall(btn.value, btn.value == 4 || btn.value == 6)
    })
})

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
    if (addBatsmanButton.style.visibility !== 'visible' && !matchState.result) {
        runs = parseInt(runs)
        //check penalty
        if (penaltiesRadio.checked) {
            matchState.battingTeam.batStats.runs += runs
            matchState.bowlingTeam.extras.penalties += runs
            updateMain()
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
            byesRadio.checked = true
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

        if (runs % 2 === 1) changeStriker()
        if (matchState.battingTeam.batStats.balls % 6 == 0) changeStriker()

        //if overs completed or team all out
        if (matchState.battingTeam.batStats.balls === matchState.overs * 6
            || matchState.battingTeam.batStats.wickets === 10
            || (matchState.innings === 2 && matchState.battingTeam.batStats.runs >= matchState.target)
        ) {
            if (matchState.innings === 2) {
                assessResult()
            } else {
                endOfInnings()
            }
        }
        updateMain()

    }
}

const changeStrike = document.getElementById('changeStrikeButton')
changeStrike.addEventListener('click', () => {
    changeStriker()
    updateMain()
})

const changeStriker = () => {
    let state = matchState.live
    state.striker = state.striker === state.batsman1 ? state.batsman2 : state.batsman1
}