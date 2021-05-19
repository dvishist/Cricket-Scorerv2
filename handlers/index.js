const { ipcRenderer, ipcMain } = require("electron")
const { getOversText } = require('../match/utils')

//centre score
const bowlTeamShort = document.querySelector("#bowlTeamShort")
const batTeamShort = document.querySelector("#batTeamShort")
const runsWickets = document.querySelector("#runsWickets")

const overs = document.querySelector("#overs")
const overSymbols = document.querySelector(".overBalls")

const msgDisplay = document.querySelector("#msgDisplay p")

const leftLogoBar = document.querySelector("#leftLogoBar img")
const rightLogoBar = document.querySelector("#rightLogoBar img")

//batsman1
const batsman1 = {
    name: document.querySelector("#batsman1Name"),
    runs: document.querySelector("#batsman1Runs"),
    balls: document.querySelector("#batsman1Balls"),
    pointer: document.querySelector("#batsman1Pointer"),
}

//batsman2
const batsman2 = {
    name: document.querySelector("#batsman2Name"),
    runs: document.querySelector("#batsman2Runs"),
    balls: document.querySelector("#batsman2Balls"),
    pointer: document.querySelector("#batsman2Pointer"),
}

const bowler = {
    name: document.querySelector("#bowlerName"),
    score: document.querySelector("#bowlerScore"),
    overs: document.querySelector("#bowlerOvers"),
}

//initialise scoreboard
ipcRenderer.on('match-created', (e, match) => {
    bowlTeamShort.innerHTML = match.bowlingTeam.short + " v"
    batTeamShort.innerHTML = match.battingTeam.short
    runsWickets.innerHTML = "0-0"
    overs.innerHTML = "0"
    msgDisplay.innerHTML = "READY TO PLAY"

    batsman1.name.innerHTML = match.battingTeam.playerList[0].name
    batsman1.balls.innerHTML = 0
    batsman1.runs.innerHTML = 0
    batsman1.pointer.setAttribute("style", "visibility:visible")

    batsman2.name.innerHTML = match.battingTeam.playerList[1].name
    batsman2.balls.innerHTML = 0
    batsman2.runs.innerHTML = 0
    batsman2.pointer.setAttribute("style", "visibility:hidden")

    bowler.name.innerHTML = match.bowlingTeam.playerList[10].name
    bowler.score.innerHTML = "0-0"
    bowler.overs.innerHTML = "0"

    leftLogoBar.src = match.battingTeam.logo ? "../images/" + match.battingTeam.logo : "../images/bat.png"
    rightLogoBar.src = match.bowlingTeam.logo ? "../images/" + match.bowlingTeam.logo : "../images/bowl.png"
})

ipcRenderer.on('update-main', (e, matchState) => {
    bowlTeamShort.innerHTML = matchState.bowlingTeam.short + " v"
    batTeamShort.innerHTML = matchState.battingTeam.short
    runsWickets.innerHTML = matchState.battingTeam.batStats.runs + "-" + matchState.battingTeam.batStats.wickets
    let teamOversText = getOversText(matchState.battingTeam.batStats.balls)
    overs.innerHTML = teamOversText
    // msgDisplay.innerHTML = "READY TO PLAY"

    batsman1.name.innerHTML = matchState.live.batsman1.name
    batsman1.balls.innerHTML = matchState.live.batsman1.batStats.balls
    batsman1.runs.innerHTML = matchState.live.batsman1.batStats.runs

    batsman2.name.innerHTML = matchState.live.batsman2.name
    batsman2.balls.innerHTML = matchState.live.batsman2.batStats.balls
    batsman2.runs.innerHTML = matchState.live.batsman2.batStats.runs

    if (matchState.live.batsman1 === matchState.live.striker) {
        batsman1.pointer.setAttribute("style", "visibility:visible")
        batsman2.pointer.setAttribute("style", "visibility:hidden")
    } else {
        batsman2.pointer.setAttribute("style", "visibility:visible")
        batsman1.pointer.setAttribute("style", "visibility:hidden")
    }

    bowler.name.innerHTML = matchState.live.bowler.name
    bowler.score.innerHTML = matchState.live.bowler.bowlStats.wickets + '-' + matchState.live.bowler.bowlStats.runs
    let bowlerOverText = getOversText(matchState.live.bowler.bowlStats.balls)
    bowler.overs.innerHTML = bowlerOverText

    leftLogoBar.src = matchState.battingTeam.logo ? "../images/" + matchState.battingTeam.logo : "../images/bat.png"
    rightLogoBar.src = matchState.bowlingTeam.logo ? "../images/" + matchState.bowlingTeam.logo : "../images/bowl.png"

})


ipcRenderer.on('fade-batsman', (e, batsman) => {
    if (batsman1.name.innerHTML === batsman.name) {
        batsman1.name.style.opacity = '30%'
        batsman1.balls.style.opacity = '30%'
        batsman1.runs.style.opacity = '30%'
    } else {
        batsman2.name.style.opacity = '30%'
        batsman2.balls.style.opacity = '30%'
        batsman2.runs.style.opacity = '30%'
    }
})

ipcRenderer.on('unfade-batsman', (e) => {
    batsman1.name.style.opacity = '100%'
    batsman1.balls.style.opacity = '100%'
    batsman1.runs.style.opacity = '100%'
    batsman2.name.style.opacity = '100%'
    batsman2.balls.style.opacity = '100%'
    batsman2.runs.style.opacity = '100%'
})

ipcRenderer.on('send-message', (e, msg) => {
    msgDisplay.innerHTML = msg
})

ipcRenderer.on('add-ball', (e, ballText) => {
    if (ballText === 'clear') {
        overSymbols.innerHTML = null
    } else if (ballText === 'remove') {
        overSymbols.removeChild(overSymbols.lastChild)
    } else {
        let p = document.createElement("p")
        p.appendChild(document.createTextNode(ballText))
        let overBall = document.createElement("div")
        overBall.setAttribute("class", "overBall")
        if (ballText === 'W') {
            overBall.style.backgroundColor = '#fc1d4e'
        } else if (ballText === '4' || ballText === '6') {
            overBall.style.backgroundColor = '#3796da'
        } else if (ballText === '0') {
            overBall.style.backgroundColor = '#151749'
        }

        overBall.appendChild(p)
        overSymbols.appendChild(overBall)
    }
})