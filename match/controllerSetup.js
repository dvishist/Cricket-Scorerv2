const fs = require('fs')
const { ipcRenderer } = require("electron")
const { cloneDeep } = require('lodash')
const randomstring = require('randomstring')

//dropdowns
const bowlerDropdown = document.querySelector("#bowlerDropdown")
const batsmanDropdown = document.querySelector("#batsmanDropdown")
const wicketFielderDropdown = document.querySelector("#wicketFielder")
const runoutFielderDropdown = document.querySelector("#runoutFielder")

const { getStrikeRate, getEconomy, getRunRate, findPlayer, getOversText } = require('../match/utils')

let activityStack = []

const endOfInningsButton = document.getElementById('endOfInnings')
endOfInningsButton.addEventListener('click', e => {
    endOfInnings()
    endOfInningsButton.style.visibility = 'hidden'
})


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
    matchState.live.batsman1.batStats.order = 1
    matchState.live.batsman2.batStats.order = 2
    matchState.live.striker = matchState.live.batsman1
    matchState.live.bowler = matchState.bowlingTeam.playerList[10]

    ipcRenderer.send('unfade-batsman')
    batsmanDropdown.style.visibility = 'hidden'
    addBatsmanButton.style.visibility = 'hidden'
    targetRadio.click()

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
    ipcRenderer.send('add-ball', 'clear')
}


const assessResult = () => {
    matchState.result = {}
    if (matchState.battingTeam.batStats.runs < matchState.bowlingTeam.batStats.runs) {
        matchState.result.winner = matchState.bowlingTeam
        matchState.result.margin = matchState.bowlingTeam.batStats.runs - matchState.battingTeam.batStats.runs
        matchState.result.method = "RUNS"
    } else if (matchState.battingTeam.batStats.runs >= matchState.target) {
        matchState.result.winner = matchState.battingTeam
        matchState.result.margin = 10 - matchState.battingTeam.batStats.wickets
        matchState.result.method = "WICKETS"
    } else {
        matchState.result.winner = "TIE"
    }
    resultRadio.click()

    const date = new Date().toLocaleDateString('en-US').replaceAll('/', '-')
    const code = randomstring.generate(5)
    const filename = matchState.battingTeam.short + 'v' + matchState.bowlingTeam.short + '(' + date + ')' + code + '.json'
    matchState.toss = matchState.toss.name
    delete matchState.innings
    delete matchState.live

    let matchData = JSON.stringify(matchState)
    console.log(filename)
    fs.writeFileSync(`./saved-games/${filename}`, matchData)
}


ipcRenderer.on('undo', e => {
    if (activityStack.length > 1) {
        activityStack.pop()
        matchState = cloneDeep(activityStack.pop())

        //update Batsman dropdown to show notout or retired  batsmen
        let notOutBatsmen = matchState.battingTeam.playerList.filter(player => (player.wicket.method === null || player.wicket.method === 'retired') && player !== matchState.live.batsman1 && player !== matchState.live.batsman2)
        notOutBatsmen.splice(notOutBatsmen.length - 1, 1)
        batsmanDropdown.innerHTML = null
        let option = document.createElement('option')
        option.disabled = true
        option.appendChild(document.createTextNode('Select Batsman'))
        batsmanDropdown.appendChild(option)
        batsmanDropdown.slectedIndex = 0
        notOutBatsmen.forEach(player => {
            let option = document.createElement('option')
            option.appendChild(document.createTextNode(player.name))
            option.value = player.name
            batsmanDropdown.appendChild(option)
        })
        let remBalls = 6 - matchState.battingTeam.batStats.balls % 6
        remBalls = remBalls === 6 ? 0 : remBalls
        ipcRenderer.send('add-ball', 'remove', remBalls)
        updateMain()
    }
})