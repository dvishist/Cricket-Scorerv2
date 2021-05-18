const bowledButton = document.getElementById('bowled')
const lbwButton = document.getElementById('lbw')
const retiredButton = document.getElementById('retired')
const caughtButton = document.getElementById('caught')
const stumpedButton = document.getElementById('stumped')
const runoutButton = document.getElementById('runout')

const wicketFielder = document.getElementById('wicketFielder')
const runoutFielder = document.getElementById('runoutFielder')

Array.from(document.getElementsByClassName('wicketButtons')).forEach(btn => {
    btn.addEventListener('click', () => {
        batsmanDropdown.style.visibility = 'visible'
        addBatsmanButton.style.visibility = 'visible'
        ipcRenderer.send('fade-batsman', matchState.live.striker)
        if (btn.id === 'runout') {
            if (wideRadio.checked) {
                matchState.live.bowler.bowlStats.runs++
                matchState.battingTeam.batStats.runs++
                matchState.live.bowler.bowlStats.wides++
                matchState.bowlingTeam.extras.wides++
            } else if (noBallRadio.checked) {
                matchState.live.bowler.bowlStats.runs++
                matchState.battingTeam.batStats.runs++
                matchState.live.bowler.bowlStats.noBalls++
                matchState.bowlingTeam.extras.noBalls++
            } else {
                matchState.battingTeam.batStats.balls++
                matchState.live.bowler.bowlStats.balls++
                matchState.live.striker.batStats.balls++
            }
        } else if (btn.id !== 'retired') {
            matchState.battingTeam.batStats.balls++
            matchState.live.bowler.bowlStats.balls++
            matchState.live.striker.batStats.balls++
        }
        if (matchState.battingTeam.batStats.balls % 6 == 0) changeStriker()
    })

})

bowledButton.addEventListener('click', () => {
    matchState.live.striker.wicket.out = true
    matchState.live.striker.wicket.method = 'bowled'
    matchState.live.striker.wicket.bowler = matchState.live.bowler

    matchState.battingTeam.batStats.wickets++
    matchState.live.bowler.bowlStats.wickets++
})

lbwButton.addEventListener('click', () => {
    matchState.live.striker.wicket.out = true
    matchState.live.striker.wicket.method = 'lbw'
    matchState.live.striker.wicket.bowler = matchState.live.bowler

    matchState.battingTeam.batStats.wickets++
    matchState.live.bowler.bowlStats.wickets++
})

retiredButton.addEventListener('click', () => {
    matchState.live.striker.wicket.method = 'retired'
})

caughtButton.addEventListener('click', () => {
    matchState.live.striker.wicket.out = true
    matchState.live.striker.wicket.method = 'caught'
    matchState.live.striker.wicket.bowler = matchState.live.bowler
    matchState.live.striker.wicket.fielder = matchState.bowlingTeam.playerList.find(player => player.name === wicketFielder.value)

    matchState.battingTeam.batStats.wickets++
    matchState.live.bowler.bowlStats.wickets++

    matchState.bowlingTeam.playerList.find(player => player.name === wicketFielder.value).fieldStats.catches++
})

stumpedButton.addEventListener('click', () => {
    matchState.live.striker.wicket.out = true
    matchState.live.striker.wicket.method = 'stumped'
    matchState.live.striker.wicket.bowler = matchState.live.bowler
    matchState.live.striker.wicket.fielder = matchState.bowlingTeam.playerList.find(player => player.name === wicketFielder.value)

    matchState.battingTeam.batStats.wickets++
    matchState.live.bowler.bowlStats.wickets++

    matchState.bowlingTeam.playerList.find(player => player.name === wicketFielder.value).fieldStats.stumpings++
})

runoutButton.addEventListener('click', () => {
    matchState.live.striker.wicket.out = true
    matchState.live.striker.wicket.method = 'runout'
    matchState.live.striker.wicket.fielder = matchState.bowlingTeam.playerList.find(player => player.name === runoutFielder.value)

    matchState.battingTeam.batStats.wickets++
    matchState.bowlingTeam.playerList.find(player => player.name === runoutFielder.value).fieldStats.runouts++
})
