let bowlerStartingRuns = 0

//Change Bowler
bowlerDropdown.addEventListener('change', function () {
    matchState.live.bowler = findPlayer(matchState.bowlingTeam, bowlerDropdown.value)
    updateMain()
    bowlerDropdown.selectedIndex = 0
    ipcRenderer.send('add-ball', 'clear')
    bowlerStartingRuns = matchState.live.bowler.bowlStats.runs
    ipcRenderer.send('add-remaining-balls', 6)
})


//Add batsman
const addBatsmanButton = document.getElementById('addBatsmanButton')
addBatsmanButton.addEventListener('click', () => {
    if (batsmanDropdown.selectedIndex !== 0) {
        let outBatsman = matchState.live.striker
        let newBatsmanName = batsmanDropdown.value
        replaceBatsman(newBatsmanName, outBatsman)
        if (matchState.battingTeam.batStats.balls % 6 == 0) changeStriker()
        updateMain()
        ipcRenderer.send('unfade-batsman')
        batsmanDropdown.style.visibility = 'hidden'
        addBatsmanButton.style.visibility = 'hidden'
    }

})

replaceBatsman = (newBatsmanName, oldBatsman) => {
    let newBatsman = findPlayer(matchState.battingTeam, newBatsmanName)
    const order = matchState.battingTeam.playerList.reduce((max, player) => {
        return Math.max(max, player.batStats.order || 0)
    }, 0)

    newBatsman.batStats.order = order + 1

    if (oldBatsman.wicket.method === 'retired') {
        if (oldBatsman.batStats.runs < 1 && oldBatsman.batStats.balls < 1) oldBatsman.wicket.method = null
        let batsmanOption = document.createElement('option')
        batsmanOption.appendChild(document.createTextNode(oldBatsman.name))
        batsmanOption.value = oldBatsman.name
        batsmanDropdown.append(batsmanOption)
    } else {
        matchState.live.lastWicket = oldBatsman
    }

    batsmanDropdown.remove(batsmanDropdown.selectedIndex)
    batsmanDropdown.selectedIndex = 0

    if (matchState.live.batsman1 === oldBatsman) {
        matchState.live.batsman1 = newBatsman
    } else {
        matchState.live.batsman2 = newBatsman
    }
    matchState.live.striker = newBatsman
    matchState.battingTeam.fallOfWickets.push({ ...matchState.battingTeam.batStats })
}