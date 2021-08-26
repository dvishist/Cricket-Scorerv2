const { ipcRenderer, remote } = require('electron')
const loadTeams = require('../match/teamsLoader')
const createMatch = require('../match/createMatch')
const axios = require('axios')
axios.defaults.baseURL = 'https://cricketscorervalidator.herokuapp.com'

const form = document.querySelector('form')

document.querySelector('button').focus()

form.addEventListener('submit', async e => {
    e.preventDefault()

    //validate through API
    // document.getElementById('codeError').style.visibility = 'visible'
    // const code = document.getElementById('code').value
    // document.getElementById('codeError').innerHTML = "verifying..."
    // if (code) {
    //     const { data } = await axios.get('validate/' + code)
    //     if (!data) {
    //         document.getElementById('codeError').style.visibility = 'visible'
    //         document.getElementById('codeError').innerHTML = "Subscription not active for the code entered! Please contact dvishist27@gmail.com"
    //         return
    //     }
    // } else {
    //     document.getElementById('codeError').style.visibility = 'visible'
    //     document.getElementById('codeError').innerHTML = "Subscription not active for the code entered! Please contact dvishist27@gmail.com"
    //     return
    // }

    const team1FileName = document.querySelector('#team1FileName').value
    const team2FileName = document.querySelector('#team2FileName').value
    const oversText = document.querySelector('#overs').value
    const tossWinnerName = document.querySelector('#tossWinner').value
    const bat = document.querySelector('#bat').checked

    try {
        const { team1Obj, team2Obj } = loadTeams(team1FileName, team2FileName)

        //needs refactoring lol
        let tossWinner
        if (tossWinnerName === team1FileName) {
            tossWinner = team1Obj
        } else if (tossWinnerName === team2FileName) {
            tossWinner = team2Obj
        } else {
            throw new Error()
        }

        //needs refactoring to check if any radio is selected 
        let decision = bat ? 'bat' : 'bowl'
        let overs = parseInt(oversText)

        if ((tossWinner === team1Obj && decision === 'bat') || (tossWinner === team2Obj && decision === 'bowl')) {
            team1Obj.playerList[0].batStats.order = 1
            team1Obj.playerList[1].batStats.order = 2
        } else {
            team2Obj.playerList[0].batStats.order = 1
            team2Obj.playerList[1].batStats.order = 2
        }

        const match = createMatch(team1Obj, team2Obj, tossWinner, decision, overs)
        ipcRenderer.send('match-created', match)
        remote.getCurrentWindow().close()
    } catch (err) {
        document.getElementById('errorMessage').style.display = 'block'
    }
})