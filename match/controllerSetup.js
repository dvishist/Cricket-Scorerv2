const { ipcRenderer, ipcMain } = require("electron")

//dropdowns
const bowlerDropdown = document.querySelector("#bowlerDropdown")
const batsmanDropdown = document.querySelector("#batsmanDropdown")
const wicketFielderDropdown = document.querySelector("#wicketFielder")
const runoutFielderDropdown = document.querySelector("#runoutFielder")


ipcRenderer.on('controller-setup', (e, match) => {
    const bowlingTeam = match.bowlingTeam.playerList
    //populate fielder dropdowns
    bowlingTeam.forEach(playerObj => {

        //add (SUB) in the name of sub fielder(12th man)
        playerName = bowlingTeam.indexOf(playerObj) === (bowlingTeam.length - 1) ? playerObj.name + " (SUB)" : playerObj.name

        //add (WK) in the name of wicket Keeper
        playerName = match.bowlingTeam.wk == playerObj ? playerObj.name + " (WK)" : playerName

        let player1 = document.createElement('option')
        player1.appendChild(document.createTextNode(playerName))
        player1.value = playerName

        let player2 = document.createElement('option')
        player2.appendChild(document.createTextNode(playerName))
        player2.value = playerName

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


    const battingTeam = match.battingTeam.playerList
    //remove openers
    let batsmanList = battingTeam.slice(2, 11)

    //populate batsman dropdown
    batsmanList.forEach(playerObj => {
        let player = document.createElement('option')
        player.appendChild(document.createTextNode(playerObj.name))
        player.value = playerObj.name
        batsmanDropdown.appendChild(player)
    })
})