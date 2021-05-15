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
    ipcRenderer.send('update-main', matchState)
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
    runs = parseInt(runs)
    //check penalty
    if (penaltiesRadio.checked) {
        matchState.battingTeam.batStats.runs += runs
        matchState.bowlingTeam.extras.penalties += runs
        ballRadio.checked = true
        runsRadio.checked = true
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

    ballRadio.checked = true
    runsRadio.checked = true
    if (runs % 2 === 1) changeStriker()
    if (matchState.battingTeam.batStats.balls % 6 == 0) changeStriker()
    updateMain()
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


//Change Bowler
bowlerDropdown.addEventListener('change', function () {
    matchState.bowlingTeam.playerList.forEach(player => {
        if (player.name === bowlerDropdown.value) matchState.live.bowler = player
    })
    updateMain()
    bowlerDropdown.selectedIndex = 0
})


//Add batsman
const addBatsmanButton = document.getElementById('addBatsmanButton')
addBatsmanButton.addEventListener('click', () => {
    replaceBatsman(batsmanDropdown.value, matchState.live.striker, false)
    updateMain()
})

replaceBatsman = (newBatsmanName, oldBatsman, wicket) => {
    matchState.battingTeam.playerList.forEach(player => {
        if (player.name === newBatsmanName) {
            newBatsman = player
        }
    })

    if (!wicket && oldBatsman.batStats.balls !== 0 && oldBatsman.batStats.runs !== 0) {
        oldBatsman.wicket.method = 'retired'
    }

    if (!wicket) {
        let batsmanOption = document.createElement('option')
        batsmanOption.appendChild(document.createTextNode(oldBatsman.name))
        batsmanOption.value = oldBatsman.name
        batsmanDropdown.append(batsmanOption)
    }
    batsmanDropdown.remove(batsmanDropdown.selectedIndex)
    batsmanDropdown.selectedIndex = 0

    if (matchState.live.batsman1 === oldBatsman) {
        matchState.live.batsman1 = newBatsman
    } else {
        matchState.live.batsman2 = newBatsman
    }
    matchState.live.striker = newBatsman

}