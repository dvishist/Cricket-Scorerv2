class Player {

    constructor(playerName) {
        this.name = playerName.replace('#C', '').replace('#WK', ''),
            this.captain = playerName.includes('#C'),
            this.wk = playerName.includes('#WK'),
            this.batStats = {
                balls: 0,
                runs: 0,
                fours: 0,
                sixes: 0,
                dots: 0,
                // ones: 0,
                // twos: 0,
                // threes:0
            },
            this.bowlStats = {
                balls: 0,
                runs: 0,
                wides: 0,
                noBalls: 0,
            },
            this.fieldStats = {
                catches: 0,
                runOuts: 0
            },
            this.wicket = {
                out: false,
                method: '',
                bowler: null,
                fielder: null
            }
    }

    getStrikeRate() {
        return (this.batStats.runs / this.batStats.balls * 100).toPrecision(5)
    }

    getEconomy() {
        return (this.bowlStats.runs / this.bowlStats.balls * 6).toPrecision(3)
    }

}