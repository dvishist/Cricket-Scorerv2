const { ipcRenderer, ipcMain } = require("electron")

const bowlTeamShort = document.querySelector("#bowlTeamShort")

ipcRenderer.on('match-created', (e, match) => {
    console.log(match)
    bowlTeamShort.innerHTML = match.bowlingTeam.short.toUpperCase() + " v"
})
