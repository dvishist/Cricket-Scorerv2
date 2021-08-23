const { ipcRenderer } = require('electron')
const { getOversText, getEconomy } = require('../match/utils')

let show = "batting"
let oldState = null

const battingTeamName = document.querySelector('#team1Name p')
const battingTeamLogo = document.querySelector('#team1Img')
const bowlingTeamName = document.querySelector('#team2Name p')
const bowlingTeamLogo = document.querySelector('#team2Img')

const extrasText = document.querySelector('#extras')
const oversText = document.querySelector('#overs')
const totalText = document.querySelector('#totalRuns')

// const battingContainer = document.querySelector('#battingContainer')
const bowlerList = document.querySelector('#bowlerList')
const fowStats = document.querySelector('#fowStats')

ipcRenderer.on('toggle-teams', () => {
    show = show === 'batting' ? 'bowling' : 'batting'
    update(oldState)
})

ipcRenderer.on('update-main', (e, matchState) => {
    oldState = matchState
    update(matchState)
})

const update = matchState => {
    let battingTeam = show === 'batting' ? matchState.battingTeam : matchState.bowlingTeam
    let bowlingTeam = show === 'batting' ? matchState.bowlingTeam : matchState.battingTeam

    battingTeamName.innerHTML = battingTeam.name.toUpperCase()
    bowlingTeamName.innerHTML = bowlingTeam.name.toUpperCase()
    battingTeamLogo.src = ('../images/' + battingTeam.logo)
    bowlingTeamLogo.src = ('../images/' + bowlingTeam.logo)

    const extras = Object.values(bowlingTeam.extras).reduce((acc, key) => acc + key)
    const overs = getOversText(battingTeam.batStats.balls)
    const total = battingTeam.batStats.runs + '/' + battingTeam.batStats.wickets

    extrasText.innerHTML = extras
    oversText.innerHTML = overs
    totalText.innerHTML = total

    populateBowlers(bowlingTeam.playerList)
    populateFow(battingTeam.fallOfWickets)
}

const populateBowlers = (playerList) => {
    bowlerList.innerHTML = ''
    playerList = playerList.slice(0, playerList.length - 1)

    const bowled = playerList
        .filter(player => player.bowlStats.balls > 0)
    const yetToBowl = 8 - bowled.length

    bowled.forEach(player => {
        const bowlerDiv = document.createElement('div')
        bowlerDiv.className = "batsman"

        const nameDiv = document.createElement('div')
        nameDiv.className = "bowlerName"
        const nameText = document.createElement('p')
        nameText.innerHTML = player.name
        nameDiv.appendChild(nameText)

        const oversDiv = document.createElement('div')
        oversDiv.className = "bowlerStats"
        const oversText = document.createElement('p')
        oversText.innerHTML = getOversText(player.bowlStats.balls)
        oversDiv.appendChild(oversText)

        const maidensDiv = document.createElement('div')
        maidensDiv.className = "bowlerStats"
        const maidensText = document.createElement('p')
        maidensText.innerHTML = player.bowlStats.maidens
        maidensDiv.appendChild(maidensText)

        const runsDiv = document.createElement('div')
        runsDiv.className = "bowlerStats"
        const runsText = document.createElement('p')
        runsText.innerHTML = player.bowlStats.runs
        runsDiv.appendChild(runsText)

        const wicketsDiv = document.createElement('div')
        wicketsDiv.className = "bowlerStats"
        const wicketsText = document.createElement('p')
        wicketsText.innerHTML = player.bowlStats.wickets
        wicketsDiv.appendChild(wicketsText)

        const economyDiv = document.createElement('div')
        economyDiv.className = "bowlerStats"
        const economyText = document.createElement('p')
        economyText.innerHTML = getEconomy(player)
        economyDiv.appendChild(economyText)

        bowlerDiv.appendChild(nameDiv)
        bowlerDiv.appendChild(oversDiv)
        bowlerDiv.appendChild(maidensDiv)
        bowlerDiv.appendChild(runsDiv)
        bowlerDiv.appendChild(wicketsDiv)
        bowlerDiv.appendChild(economyDiv)

        bowlerList.appendChild(bowlerDiv)
    })

    for (let i = 0; i < yetToBowl; i++) {
        const bowlerDiv = document.createElement('div')
        bowlerDiv.className = "batsman"
        bowlerList.appendChild(bowlerDiv)

    }
}


const populateFow = fow => {
    fowStats.innerHTML = ''
    const fowName = document.createElement('div')
    fowName.classList.add('bowlerName')
    fowName.classList.add('fowName')
    // const randText = document.createElement('p')
    // randText.innerHTML = "ASDHBJABHSD"
    // fowName.appendChild(randText)
    fowStats.appendChild(fowName)
    fow.forEach(wicket => {
        const wicketDiv = document.createElement('div')
        wicketDiv.classList.add('bowlerStats')
        wicketDiv.classList.add('fowStats')
        const wicketRuns = document.createElement('p')
        wicketRuns.innerHTML = wicket.runs
        wicketDiv.appendChild(wicketRuns)
        fowStats.appendChild(wicketDiv)
    })

    const rest = 10 - fow.length
    for (let i = 0; i < rest; i++) {
        const wicketDiv = document.createElement('div')
        wicketDiv.classList.add('bowlerStats')
        wicketDiv.classList.add('fowStats')
        fowStats.appendChild(wicketDiv)
    }

}