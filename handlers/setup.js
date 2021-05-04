const { ipcRenderer } = require('electron')
const loadTeams = require('../match/teamsLoader')

const form = document.querySelector('form')

form.addEventListener('submit', e => {
    e.preventDefault()
    const team1FileName = document.querySelector('#team1FileName').value
    const team2FileName = document.querySelector('#team2FileName').value
    const overs = document.querySelector('#overs').value
    const tossWinner = document.querySelector('#tossWinner').value
    const decision = document.querySelector('#bat').checked

    try {
        const { team1Obj, team2Obj } = loadTeams(team1FileName, team2FileName)

    } catch (err) {
        alert('Please make sure file names are correct')
    }

})