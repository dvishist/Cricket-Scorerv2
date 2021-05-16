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
    matchState.live.bowler = matchState.bowlingTeam.playerList.filter(player => player.name === bowlerDropdown.value)[0]
    updateMain()
    bowlerDropdown.selectedIndex = 0
})


//Add batsman
const addBatsmanButton = document.getElementById('addBatsmanButton')
addBatsmanButton.addEventListener('click', () => {
    let outBatsman = (matchState.live.batsman1.wicket.method != null) ? matchState.live.batsman1 : matchState.live.batsman2
    let newBatsmanName = batsmanDropdown.value
    replaceBatsman(newBatsmanName, outBatsman)
    updateMain()
    ipcRenderer.send('unfade-batsman', newBatsmanName)
    batsmanDropdown.style.visibility = 'hidden'
    addBatsmanButton.style.visibility = 'hidden'
})

replaceBatsman = (newBatsmanName, oldBatsman) => {
    let newBatsman = matchState.battingTeam.playerList.filter(player => player.name === newBatsmanName)[0]

    if (oldBatsman.wicket.method === 'retired') {
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



//WICKETS

const bowledButton = document.getElementById('bowled')
const lbwButton = document.getElementById('lbw')
const retiredButton = document.getElementById('retired')
const caughtButton = document.getElementById('caught')
const stumpedButton = document.getElementById('stumped')
const runoutButton = document.getElementById('runout')

const wicketFielder = document.getElementById('wicketFielder')
const runoutFielder = document.getElementById('runoutFielder')

Array.from(document.getElementsByClassName('wicketButtons')).forEach(btn => {
    btn.addEventListener('click', () => {
        batsmanDropdown.style.visibility = 'visible'
        addBatsmanButton.style.visibility = 'visible'
        ipcRenderer.send('fade-batsman', matchState.live.striker)
    })

})

bowledButton.addEventListener('click', () => {
    matchState.live.striker.wicket.out = true
    matchState.live.striker.wicket.method = 'bowled'
    matchState.live.striker.wicket.bowler = matchState.live.bowler

    matchState.battingTeam.batStats.wickets++
    matchState.live.bowler.bowlStats.wickets++
})

lbwButton.addEventListener('click', () => {
    matchState.live.striker.wicket.out = true
    matchState.live.striker.wicket.method = 'lbw'
    matchState.live.striker.wicket.bowler = matchState.live.bowler

    matchState.battingTeam.batStats.wickets++
    matchState.live.bowler.bowlStats.wickets++
})

retiredButton.addEventListener('click', () => {
    matchState.live.striker.wicket.method = 'retired'
})

caughtButton.addEventListener('click', () => {
    matchState.live.striker.wicket.out = true
    matchState.live.striker.wicket.method = 'caught'
    matchState.live.striker.wicket.bowler = matchState.live.bowler
    matchState.live.striker.wicket.fielder = matchState.bowlingTeam.playerList.filter(player => player.name === wicketFielder.value)[0]

    matchState.battingTeam.batStats.wickets++
    matchState.live.bowler.bowlStats.wickets++

    matchState.bowlingTeam.playerList.filter(player => player.name === wicketFielder.value)[0].fieldStats.catches++
})

stumpedButton.addEventListener('click', () => {
    matchState.live.striker.wicket.out = true
    matchState.live.striker.wicket.method = 'stumped'
    matchState.live.striker.wicket.bowler = matchState.live.bowler
    matchState.live.striker.wicket.fielder = matchState.bowlingTeam.playerList.filter(player => player.name === wicketFielder.value)[0]

    matchState.battingTeam.batStats.wickets++
    matchState.live.bowler.bowlStats.wickets++

    matchState.bowlingTeam.playerList.filter(player => player.name === wicketFielder.value)[0].fieldStats.stumpings++
})

runoutButton.addEventListener('click', () => {
    matchState.live.striker.wicket.out = true
    matchState.live.striker.wicket.method = 'runout'
    matchState.live.striker.wicket.fielder = matchState.bowlingTeam.playerList.filter(player => player.name === runoutFielder.value)[0]

    matchState.battingTeam.batStats.wickets++

    matchState.bowlingTeam.playerList.filter(player => player.name === wicketFielder.value)[0].fieldStats.runouts++
})