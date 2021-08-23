const { ipcRenderer } = require('electron')
const { getOversText, outMethods } = require('../match/utils')

let show = "batting"
let oldState = null

const battingTeamName = document.querySelector('#team1Name p')
const battingTeamLogo = document.querySelector('#team1Img')
const bowlingTeamName = document.querySelector('#team2Name p')
const bowlingTeamLogo = document.querySelector('#team2Img')

const extrasText = document.querySelector('#extras')
const oversText = document.querySelector('#overs')
const totalText = document.querySelector('#totalRuns')

const battingContainer = document.querySelector('#battingContainer')

ipcRenderer.on('toggle-teams', () => {
    show = show === 'batting' ? 'bowling' : 'batting'
    update(oldState)
})

ipcRenderer.on('update-main', (e, matchState) => {
    oldState = matchState
    console.log(matchState)
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

    populateBatsmen(battingTeam.playerList)
}

const populateBatsmen = (playerList) => {
    battingContainer.innerHTML = ''
    playerList = playerList.slice(0, playerList.length - 1)

    const batted = playerList
        .filter(player => player.batStats.order)
        .sort((p1, p2) => {
            p1.batStats.order - p2.batStats.order
        })

    const yetToBat = playerList
        .filter(player => !player.batStats.order)

    batted.forEach((player) => {
        const batsmanDiv = document.createElement('div')
        batsmanDiv.className = 'batsman'

        const nameDiv = document.createElement('div')
        nameDiv.classList.add('name')
        const nameText = document.createElement('p')
        nameText.innerHTML = player.name
        nameDiv.appendChild(nameText)

        const wicketDiv = document.createElement('div')
        wicketDiv.classList.add('wicket')
        const fielderText = document.createElement('p')
        const bowlerText = document.createElement('p')
        if (player.wicket.out) {
            if (player.wicket.bowler) {
                if (player.wicket.method === "lbw")
                    bowlerText.innerHTML = "lbw " + player.wicket.bowler.name
                else {
                    bowlerText.innerHTML = "b " + player.wicket.bowler.name
                }
            } else {
                bowlerText.innerHTML = ""
            }

            if (Object.keys(outMethods).includes(player.wicket.method))
                fielderText.innerHTML = outMethods[player.wicket.method] + " " + player.wicket.fielder.name
        } else if (player.wicket.method === "retired")
            fielderText.innerHTML = 'retired'
        else {
            fielderText.innerHTML = 'NOT OUT'
        }
        wicketDiv.appendChild(fielderText)
        wicketDiv.appendChild(bowlerText)

        const runsDiv = document.createElement('div')
        runsDiv.classList.add('runs')
        const runsText = document.createElement('p')
        runsText.innerHTML = player.batStats.runs
        runsDiv.appendChild(runsText)

        const ballsDiv = document.createElement('div')
        ballsDiv.classList.add('balls')
        const ballsText = document.createElement('p')
        ballsText.innerHTML = player.batStats.balls
        ballsDiv.appendChild(ballsText)


        batsmanDiv.appendChild(nameDiv)
        batsmanDiv.appendChild(wicketDiv)
        batsmanDiv.appendChild(runsDiv)
        batsmanDiv.appendChild(ballsDiv)

        if (!player.wicket.out && player.wicket.method !== 'retired') {
            batsmanDiv.classList.add('notout')
        }

        battingContainer.appendChild(batsmanDiv)
    })

    yetToBat.forEach(player => {
        const batsmanDiv = document.createElement('div')
        batsmanDiv.className = 'batsman'

        const nameDiv = document.createElement('div')
        nameDiv.classList.add('name')
        const nameText = document.createElement('p')
        nameText.innerHTML = player.name
        nameDiv.appendChild(nameText)

        const wicketDiv = document.createElement('div')
        wicketDiv.classList.add('wicket')


        const runsDiv = document.createElement('div')
        runsDiv.classList.add('runs')


        const ballsDiv = document.createElement('div')
        ballsDiv.classList.add('balls')

        batsmanDiv.appendChild(nameDiv)
        batsmanDiv.appendChild(wicketDiv)
        batsmanDiv.appendChild(runsDiv)
        batsmanDiv.appendChild(ballsDiv)

        battingContainer.appendChild(batsmanDiv)
    })

    battingContainer.firstChild.classList.add('topBatsman')
    battingContainer.lastChild.classList.add('botBatsman')
}