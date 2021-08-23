const { ipcRenderer } = require("electron")
const { getStrikeRate, outMethods } = require('../match/utils')

const playerName = document.getElementById('name')
const runs = document.getElementById('runs')
const balls = document.getElementById('balls')

const fielder = document.getElementById('fielder')
const bowler = document.getElementById('bowler')

const fours = document.getElementById('fours')
const sixes = document.getElementById('sixes')
const strikeRate = document.getElementById('strikeRate')

const strikerRadio = document.getElementById('strikerRadio')
const nonStrikerRadio = document.getElementById('nonStrikerRadio')

const strikerLabel = document.getElementById('strikerLabel')
const nonStrikerLabel = document.getElementById('nonStrikerLabel')

const image = document.getElementById('logoImg')

strikerRadio.addEventListener('change', () => {
    updateView()
})

nonStrikerRadio.addEventListener('change', () => {
    updateView()
})

let batsman1 = null
let batsman2 = null

ipcRenderer.on('set-logo', (e, image) => {
    console.log(image)
    document.getElementById('logoImg').src = '../images/' + image
})

ipcRenderer.on('update-player', (e, players) => {
    batsman1 = players[0]
    batsman2 = players[1]
    strikerLabel.innerHTML = batsman1.name
    nonStrikerLabel.innerHTML = batsman2.name
    updateView()
})

const updateView = () => {
    let viewPlayer = strikerRadio.checked ? batsman1 : batsman2

    const { name, batStats, wicket } = viewPlayer
    playerName.innerHTML = name
    let runsText = batStats.runs
    if (!wicket.out) runsText += "*"
    runs.innerHTML = runsText
    balls.innerHTML = " (" + batStats.balls + ")"

    if (wicket.bowler) {
        if (wicket.method === "lbw")
            bowler.innerHTML = "lbw " + wicket.bowler.name
        else {
            bowler.innerHTML = "b " + wicket.bowler.name
        }
    } else {
        bowler.innerHTML = ""
    }
    if (wicket.method === "retired") fielder.innerHTML = 'retired'
    else if (Object.keys(outMethods).includes(wicket.method)) fielder.innerHTML = outMethods[wicket.method] + " " + wicket.fielder.name
    else fielder.innerHTML = ""

    fours.innerHTML = "FOURS " + batStats.fours
    sixes.innerHTML = "SIXES " + batStats.sixes
    const sr = getStrikeRate(viewPlayer)
    strikeRate.innerHTML = "STRIKE-RATE " + sr
    if (sr === NaN) strikeRate.innerHTML = "STRIKE-RATE 0"
}
