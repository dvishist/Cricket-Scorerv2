const { ipcRenderer } = require('electron')
const remote = require('electron').remote
const loadTeams = require('../match/teamsLoader')
const createMatch = require('../match/createMatch')


const form = document.querySelector('form')

form.addEventListener('submit', e => {
    e.preventDefault()
    const team1FileName = document.querySelector('#team1FileName').value
    const team2FileName = document.querySelector('#team2FileName').value
    const oversText = document.querySelector('#overs').value
    const tossWinnerName = document.querySelector('#tossWinner').value
    const bat = document.querySelector('#bat').checked

    try {
        const { team1Obj, team2Obj } = loadTeams(team1FileName, team2FileName)

        let tossWinner = tossWinnerName === team1FileName ? team1Obj : team2Obj
        let decision = bat ? 'bat' : 'bowl'
        let overs = parseInt(oversText)
        const match = createMatch(team1Obj, team2Obj, tossWinner, decision, overs)

        ipcRenderer.send('match-created', match)
        alert('Match Created! \nReady to Play')
        remote.getCurrentWindow().close()
    } catch (err) {
        alert('Please make sure file names are correct')
    }


})