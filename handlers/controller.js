
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


const endOfInnings = () => {
    [matchState.battingTeam, matchState.bowlingTeam] = [matchState.bowlingTeam, matchState.battingTeam]
    matchState.innings = 2
    matchState.target = matchState.bowlingTeam.batStats.runs + 1
    matchState.live.batsman1 = matchState.battingTeam.playerList[0]
    matchState.live.batsman2 = matchState.battingTeam.playerList[1]
    matchState.live.striker = matchState.live.batsman1
    matchState.live.bowler = matchState.bowlingTeam.playerList[10]

    ipcRenderer.send('controller-setup', matchState)

    bowlerDropdown.innerHTML = ""
    let selectBowlerOption = document.createElement('option')
    selectBowlerOption.appendChild(document.createTextNode('Select Bowler'))
    selectBowlerOption.selected = true
    selectBowlerOption.disabled = true
    bowlerDropdown.appendChild(selectBowlerOption)

    wicketFielder.innerHTML = ""

    let selectFielderOption = document.createElement('option')
    selectFielderOption.appendChild(document.createTextNode('Select Fielder'))
    selectFielderOption.selected = true
    selectFielderOption.disabled = true
    wicketFielder.appendChild(selectFielderOption)

    runoutFielder.innerHTML = ""
    let selectROFielderOption = document.createElement('option')
    selectROFielderOption.appendChild(document.createTextNode('Select Fielder'))
    selectROFielderOption.selected = true
    selectROFielderOption.disabled = true
    runoutFielder.appendChild(selectROFielderOption)

    batsmanDropdown.innerHTML = ""
    let selectBatsman = document.createElement('option')
    selectBatsman.appendChild(document.createTextNode('Select Batsman'))
    selectBatsman.selected = true
    selectBatsman.disabled = true
    batsmanDropdown.appendChild(selectBatsman)

    const bowlingTeam = matchState.bowlingTeam.playerList
    //populate fielder dropdowns
    bowlingTeam.forEach(playerObj => {

        //add (SUB) in the name of sub fielder(12th man)
        playerName = bowlingTeam.indexOf(playerObj) === (bowlingTeam.length - 1) ? playerObj.name + " (SUB)" : playerObj.name

        //add (WK) in the name of wicket Keeper
        playerName = matchState.bowlingTeam.wk === playerObj ? playerObj.name + " (WK)" : playerName

        let player1 = document.createElement('option')
        player1.appendChild(document.createTextNode(playerName))
        player1.value = playerObj.name

        let player2 = document.createElement('option')
        player2.appendChild(document.createTextNode(playerName))
        player2.value = playerObj.name

        wicketFielderDropdown.appendChild(player1)
        runoutFielderDropdown.appendChild(player2)
    })

    //remove sub fielder
    let bowlersList = bowlingTeam.slice(0, 11)

    //populate bowler dropdown
    bowlersList.forEach(playerObj => {
        let player = document.createElement('option')
        player.appendChild(document.createTextNode(playerObj.name))
        player.value = playerObj.name
        bowlerDropdown.appendChild(player)
    })

    const battingTeam = matchState.battingTeam.playerList
    //remove openers
    let batsmanList = battingTeam.slice(2, 11)

    //populate batsman dropdown
    batsmanList.forEach(playerObj => {
        let player = document.createElement('option')
        player.appendChild(document.createTextNode(playerObj.name))
        player.value = playerObj.name
        batsmanDropdown.appendChild(player)
    })

    updateMain()
}


const updateMain = () => {
    ballRadio.checked = true
    runsRadio.checked = true
    wicketFielder.selectedIndex = 0
    runoutFielder.selectedIndex = 0
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
        if (btn.id === 'runout') {
            if (wideRadio.checked) {
                matchState.live.bowler.bowlStats.runs++
                matchState.battingTeam.batStats.runs++
                matchState.live.bowler.bowlStats.wides++
                matchState.bowlingTeam.extras.wides++
            } else if (noBallRadio.checked) {
                matchState.live.bowler.bowlStats.runs++
                matchState.battingTeam.batStats.runs++
                matchState.live.bowler.bowlStats.noBalls++
                matchState.bowlingTeam.extras.noBalls++
            } else {
                matchState.battingTeam.batStats.balls++
                matchState.live.bowler.bowlStats.balls++
                matchState.live.striker.batStats.balls++
            }
        } else {
            matchState.battingTeam.batStats.balls++
            matchState.live.bowler.bowlStats.balls++
            matchState.live.striker.batStats.balls++
        }

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
    matchState.bowlingTeam.playerList.filter(player => player.name === runoutFielder.value)[0].fieldStats.runouts++
})