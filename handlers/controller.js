const { ipcRenderer, ipcMain } = require("electron")

const bowlerDropdown = document.querySelector("#bowlerDropdown")
const batsmanDropdown = document.querySelector("#batsmanDropdown")

ipcRenderer.on('setup', (e, match) => {
    console.log(match)
    const battingTeam = match.battingTeam.playerList
    battingTeam.splice(0, 2)
    const bowlingTeam = match.bowlingTeam.playerList
    bowlingTeam.pop()
    bowlingTeam.forEach(playerObj => {
        let player = document.createElement('option')
        player.appendChild(document.createTextNode(playerObj.name.toUpperCase()))
        player.value = playerObj.name.toUpperCase()
        bowlerDropdown.appendChild(player)
    });
})