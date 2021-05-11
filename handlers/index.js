const { ipcRenderer, ipcMain } = require("electron")

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
    bowlTeamShort.innerHTML = match.bowlingTeam.short.toUpperCase() + " v"
    batTeamShort.innerHTML = match.battingTeam.short.toUpperCase()
    runsWickets.innerHTML = "0-0"
    overs.innerHTML = "0"
    msgDisplay.innerHTML = "READY TO PLAY"

    batsman1.name.innerHTML = match.battingTeam.playerList[0].name.toUpperCase()
    batsman1.balls.innerHTML = 0
    batsman1.runs.innerHTML = 0
    batsman1.pointer.setAttribute("style", "visibility:visible")

    batsman2.name.innerHTML = match.battingTeam.playerList[1].name.toUpperCase()
    batsman2.balls.innerHTML = 0
    batsman2.runs.innerHTML = 0
    batsman2.pointer.setAttribute("style", "visibility:hidden")

    bowler.name.innerHTML = match.bowlingTeam.playerList[10].name.toUpperCase()
    bowler.score.innerHTML = "0-0"
    bowler.overs.innerHTML = "0"

    // let p = document.createElement("p")
    // p.appendChild(document.createTextNode(""))
    // let overBall = document.createElement("div")
    // overBall.setAttribute("class", "overBall")
    // overBall.appendChild(p)
    // overSymbols.appendChild(overBall)

})
