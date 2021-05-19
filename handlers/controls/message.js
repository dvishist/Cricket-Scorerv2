const sendMessage = msg => {
    ipcRenderer.send('send-message', msg)
}

const messageRadio = document.getElementById('textMessageRadio')
const textMessage = document.getElementById('textMessage')
const tossRadio = document.getElementById('tossRadio')
const runRateRadio = document.getElementById('runRateRadio')
const reqRunRateRadio = document.getElementById('reqRunRateRadio')
const lastWicketRadio = document.getElementById('lastWicketRadio')
const partnershipRadio = document.getElementById('partnershipRadio')
const targetRadio = document.getElementById('targetRadio')
const chaseRadio = document.getElementById('chaseRadio')
const resultRadio = document.getElementById('resultRadio')

messageRadio.addEventListener('click', e => {
    sendMessage(textMessage.value)
})

tossRadio.addEventListener('click', e => {
    let str = matchState.toss.short + ' WON THE TOSS AND ELECTED TO ' + matchState.decision.toUpperCase()
    sendMessage(str)
})

runRateRadio.addEventListener('click', e => {
    sendMessage("RUN RATE: " + getRunRate(matchState.battingTeam).toString())
})

lastWicketRadio.addEventListener('click', e => {
    if (matchState.live.lastWicket) {
        let { name, batStats: { runs, balls } } = matchState.live.lastWicket
        sendMessage("LAST WICKET: " + name + " " + runs.toString() + " (" + balls.toString() + ")")
    }
})

partnershipRadio.addEventListener('click', e => {
    let stats = matchState.battingTeam.batStats
    if (matchState.battingTeam.fallOfWickets.length === 0) {
        sendMessage("PARTNERSHIP: " + stats.runs.toString() + " RUNS FROM " + stats.balls.toString() + " BALLS")
    } else {
        let runs = stats.runs - matchState.battingTeam.fallOfWickets[matchState.battingTeam.fallOfWickets.length - 1].runs
        let balls = stats.balls - matchState.battingTeam.fallOfWickets[matchState.battingTeam.fallOfWickets.length - 1].balls
        sendMessage("PARTNERSHIP: " + runs.toString() + " RUNS FROM " + balls.toString() + " BALLS")
    }
})

targetRadio.addEventListener('click', e => {
    if (matchState.innings === 1) {
        sendMessage("1ST INNINGS")
    } else if (matchState.target) {
        sendMessage("TARGET " + matchState.target.toString())
    }
})

chaseRadio.addEventListener('click', e => {
    if (matchState.innings === 1) {
        sendMessage("1ST INNINGS")
    } else {
        sendMessage(
            "NEED "
            + (matchState.target - matchState.battingTeam.batStats.runs).toString()
            + " RUNS FROM "
            + ((matchState.overs * 6) - (matchState.battingTeam.batStats.balls)).toString()
            + " BALLS")
    }
})

reqRunRateRadio.addEventListener('click', e => {
    if (matchState.innings === 1) {
        sendMessage("1ST INNINGS")
    } else {
        let runs = matchState.target - matchState.battingTeam.batStats.runs
        let balls = (matchState.overs * 6) - (matchState.battingTeam.batStats.balls)
        sendMessage("REQUIRED RUN RATE: " + getRunRate({ batStats: { runs, balls } }))
    }
})


resultRadio.addEventListener('click', e => {
    if (!matchState.result) {
        chaseRadio.click()
    } else if (matchState.result.method) {
        sendMessage(matchState.result.winner.short + " WINS BY " + matchState.result.margin + " " + matchState.result.method)
    } else {
        sendMessage("MATCH TIED")
    }
})