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

messageRadio.addEventListener('click', e => {
    sendMessage(textMessage.value)
})

tossRadio.addEventListener('click', e => {
    let str = matchState.toss.short + ' WON THE TOSS AND ELECTED TO ' + matchState.decision.toUpperCase()
    sendMessage(str)
})

runRateRadio.addEventListener('click', e => {
    sendMessage("Run Rate: " + getRunRate(matchState.battingTeam).toString())
})