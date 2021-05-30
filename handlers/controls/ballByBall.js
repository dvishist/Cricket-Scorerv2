let matchState

//ball types
const ballRadio = document.getElementById("ball")
const noBallRadio = document.getElementById("noBall")
const wideRadio = document.getElementById("wide")

//runs types
const runsRadio = document.getElementById("runs")
const byesRadio = document.getElementById("byes")
const legByesRadio = document.getElementById("legByes")
const penaltiesRadio = document.getElementById("penalties")


const updateMain = state => {
    ballRadio.checked = true
    runsRadio.checked = true
    wicketFielder.selectedIndex = 0
    runoutFielder.selectedIndex = 0
    runoutRuns.value = null

    ipcRenderer.send('update-main', matchState)

    //update msg display by auto clicking the checked radio
    document.querySelector('[name="msg"]:checked').click()

    if (state !== 'wicket') activityStack.push(cloneDeep(matchState))
    if (activityStack.length > 20) activityStack.shift()
}

// ball by ball buttons
Array.from(document.getElementsByClassName("valued")).forEach(btn => {
    btn.addEventListener('click', () => {
        playBall(btn.value, btn.value == 4 || btn.value == 6)
    })
})

const changeStrikeButton = document.getElementById("changeStrikeButton")

ipcRenderer.on('controller-setup', (e, match) => {
    matchState = match
    matchState.live = {}
    matchState.live.batsman1 = matchState.battingTeam.playerList[0]
    matchState.live.batsman2 = matchState.battingTeam.playerList[1]
    matchState.live.striker = matchState.live.batsman1
    matchState.live.bowler = matchState.bowlingTeam.playerList[10]
    activityStack.push(cloneDeep(matchState))
})

const playBall = (runs, boundary) => {
    if (addBatsmanButton.style.visibility !== 'visible' && !matchState.result && matchState.innings !== 'break') {
        runs = parseInt(runs)
        let ballText = ''
        //check penalty
        if (penaltiesRadio.checked) {
            matchState.battingTeam.batStats.runs += runs
            matchState.bowlingTeam.extras.penalties += runs
            updateMain()
            return
        }

        //check ball type
        let ballType
        if (ballRadio.checked) {
            ballType = 'ball'
            matchState.battingTeam.batStats.balls++
            matchState.live.bowler.bowlStats.balls++
            matchState.live.striker.batStats.balls++
        } else if (noBallRadio.checked) {
            ballType = 'noBall'
            ballText = ballText + 'nb'
            matchState.bowlingTeam.extras.noBalls++
            matchState.live.bowler.bowlStats.noBalls++
            matchState.live.bowler.bowlStats.runs++
            matchState.battingTeam.batStats.runs++
        } else if (wideRadio.checked) {
            ballType = 'wide'
            ballText = ballText + 'wd'
            byesRadio.checked = true
            matchState.bowlingTeam.extras.wides++
            matchState.live.bowler.bowlStats.wides++
            matchState.live.bowler.bowlStats.runs++
            matchState.battingTeam.batStats.runs++
        }

        //check bat type
        matchState.battingTeam.batStats.runs += runs
        ballText = runs + ballText
        let runsType
        if (runsRadio.checked) {
            runsType = 'runs'
            matchState.live.striker.batStats.runs += runs
            matchState.live.bowler.bowlStats.runs += runs
            if (boundary) {
                if (runs === 4) {
                    matchState.battingTeam.batStats.fours++
                    matchState.live.striker.batStats.fours++
                } else {
                    matchState.battingTeam.batStats.sixes++
                    matchState.live.striker.batStats.sixes++
                }
            }
        } else if (byesRadio.checked) {
            runsType = 'byes'
            if (ballText.length === 1) ballText = ballText + 'b'
            matchState.bowlingTeam.extras.byes += runs
        } else if (legByesRadio.checked) {
            runsType = 'legByes'
            if (ballText.length === 1) ballText = ballText + 'lb'
            matchState.bowlingTeam.extras.legByes += runs
        }

        matchState.battingTeam.timeline.push({
            ball: getOversText(matchState.battingTeam.batStats.balls),
            batsman: cloneDeep(matchState.live.striker),
            bowler: cloneDeep(matchState.live.bowler),
            ballType, runsType, runs, boundary,
            score: {
                runs: matchState.battingTeam.batStats.runs,
                wickets: matchState.battingTeam.batStats.wickets
            }
        })

        if (runs % 2 === 1) changeStriker()
        if (matchState.battingTeam.batStats.balls % 6 === 0 && !noBallRadio.checked && !wideRadio.checked) {
            changeStriker()
            assessMaiden()
            bowlerDropdown.style.visibility = 'visible'
        } else {
            bowlerDropdown.style.visibility = 'hidden'
        }

        //if overs completed or team all out
        if (matchState.battingTeam.batStats.balls === matchState.overs * 6
            || matchState.battingTeam.batStats.wickets === 10
            || (matchState.innings === 2 && matchState.battingTeam.batStats.runs >= matchState.target)
        ) {
            if (matchState.innings === 2) {
                assessResult()
            } else {
                endOfInningsButton.style.visibility = 'visible'
                matchState.innings = 'break'
            }
        }
        updateMain()
        if (ballText === '0') ballText = '●'
        if (ballText === '0nb') ballText = 'nb'
        if (ballText === '0wd') ballText = 'wd'
        ipcRenderer.send('add-ball', ballText)
        let remBalls = 6 - matchState.battingTeam.batStats.balls % 6
        remBalls = remBalls === 6 ? 0 : remBalls
        ipcRenderer.send('add-remaining-balls', remBalls)
    }
}

const changeStrike = document.getElementById('changeStrikeButton')
changeStrike.addEventListener('click', () => {
    changeStriker()
    updateMain()
})

const changeStriker = () => {
    let state = matchState.live
    state.striker = state.striker === state.batsman1 ? state.batsman2 : state.batsman1
}

const assessMaiden = () => {
    let currentOver = Math.trunc(matchState.battingTeam.batStats.balls / 6).toString()
    let lastOver = (currentOver - 1).toString()
    let currentRuns = matchState.live.bowler.bowlStats.runs
    let previousRuns = bowlerStartingRuns
    if (currentRuns === previousRuns) matchState.live.bowler.bowlStats.maidens++
}