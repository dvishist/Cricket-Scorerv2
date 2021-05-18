const { ipcRenderer, ipcMain } = require("electron")

//dropdowns
const bowlerDropdown = document.querySelector("#bowlerDropdown")
const batsmanDropdown = document.querySelector("#batsmanDropdown")
const wicketFielderDropdown = document.querySelector("#wicketFielder")
const runoutFielderDropdown = document.querySelector("#runoutFielder")

const { getStrikeRate, getEconomy, getRunRate } = require('../match/utils')


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


const endOfInnings = () => {
    [matchState.battingTeam, matchState.bowlingTeam] = [matchState.bowlingTeam, matchState.battingTeam]
    matchState.innings = 2
    matchState.target = matchState.bowlingTeam.batStats.runs + 1
    matchState.live.batsman1 = matchState.battingTeam.playerList[0]
    matchState.live.batsman2 = matchState.battingTeam.playerList[1]
    matchState.live.striker = matchState.live.batsman1
    matchState.live.bowler = matchState.bowlingTeam.playerList[10]

    // ipcRenderer.send('controller-setup', matchState)

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