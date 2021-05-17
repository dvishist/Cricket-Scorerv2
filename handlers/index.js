const { ipcRenderer, ipcMain } = require("electron")
const { getOversText } = require('../match/utils')

//centre score
const bowlTeamShort = document.querySelector("#bowlTeamShort")
const batTeamShort = document.querySelector("#batTeamShort")
const runsWickets = document.querySelector("#runsWickets")

const overs = document.querySelector("#overs")
const overSymbols = document.querySelector(".overBalls")

const msgDisplay = document.querySelector("#msgDisplay p")

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

    // let p = document.createElement("p")
    // p.appendChild(document.createTextNode(""))
    // let overBall = document.createElement("div")
    // overBall.setAttribute("class", "overBall")
    // overBall.appendChild(p)
    // overSymbols.appendChild(overBall)
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


ipcRenderer.on('unfade-batsman', (e, batsman) => {
    console.log(batsman)
    if (batsman1.name.innerHTML === batsman) {
        batsman1.name.style.opacity = '100%'
        batsman1.balls.style.opacity = '100%'
        batsman1.runs.style.opacity = '100%'
    } else {
        batsman2.name.style.opacity = '100%'
        batsman2.balls.style.opacity = '100%'
        batsman2.runs.style.opacity = '100%'
    }
})