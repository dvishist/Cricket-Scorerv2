const bowledButton = document.getElementById('bowled')
const lbwButton = document.getElementById('lbw')
const retiredButton = document.getElementById('retired')
const caughtButton = document.getElementById('caught')
const stumpedButton = document.getElementById('stumped')
const runoutButton = document.getElementById('runout')

const wicketFielder = document.getElementById('wicketFielder')
const runoutFielder = document.getElementById('runoutFielder')
const runoutRuns = document.getElementById('runoutRuns')

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
    matchState.live.striker.wicket.fielder = findPlayer(matchState.bowlingTeam, wicketFielder.value)

    matchState.battingTeam.batStats.wickets++
    matchState.live.bowler.bowlStats.wickets++

    findPlayer(matchState.bowlingTeam, wicketFielder.value).fieldStats.catches++
})

stumpedButton.addEventListener('click', () => {
    matchState.live.striker.wicket.out = true
    matchState.live.striker.wicket.method = 'stumped'
    matchState.live.striker.wicket.bowler = matchState.live.bowler
    matchState.live.striker.wicket.fielder = findPlayer(matchState.bowlingTeam, wicketFielder.value)

    matchState.battingTeam.batStats.wickets++
    matchState.live.bowler.bowlStats.wickets++

    findPlayer(matchState.bowlingTeam, wicketFielder.value).fieldStats.stumpings++
})

runoutButton.addEventListener('click', () => {
    matchState.live.striker.wicket.out = true
    matchState.live.striker.wicket.method = 'runout'
    let fielder = findPlayer(matchState.bowlingTeam, runoutFielder.value)

    if (runoutRuns.value) {
        matchState.battingTeam.batStats.runs += parseInt(runoutRuns.value)
        matchState.live.striker.batStats.runs += parseInt(runoutRuns.value)
        matchState.live.bowler.bowlStats.runs += parseInt(runoutRuns.value)
    }

    matchState.live.striker.wicket.fielder = fielder
    matchState.battingTeam.batStats.wickets++
    fielder.fieldStats.runouts++
})

Array.from(document.getElementsByClassName('wicketButtons')).forEach(btn => {
    btn.addEventListener('click', () => {
        if (addBatsmanButton.style.visibility !== 'visible' && !matchState.result && matchState.innings !== 'break') {
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
                    matchState.live.striker.batStats.balls++
                    matchState.live.bowler.bowlStats.balls++
                    matchState.battingTeam.batStats.balls++
                }
            } else if (btn.id !== 'retired') {
                matchState.battingTeam.batStats.balls++
                matchState.live.bowler.bowlStats.balls++
                matchState.live.striker.batStats.balls++
            }

            //if overs completed or team all out
            if (matchState.battingTeam.batStats.balls === matchState.overs * 6 || matchState.battingTeam.batStats.wickets === 10) {
                if (matchState.innings === 2) {
                    assessResult()
                } else {
                    endOfInningsButton.style.visibility = 'visible'
                    matchState.innings = 'break'
                }
            }
            ipcRenderer.send('add-ball', 'W')
        }
        updateMain('wicket')
    })
})