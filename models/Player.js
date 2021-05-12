class Player {

    constructor(playerName) {
        this.name = playerName.trim()
        this.batStats = {
            balls: 0,
            runs: 0,
            fours: 0,
            sixes: 0,
            //dots: 0,
            // ones: 0,
            // twos: 0,
            // threes:0
        },
            this.bowlStats = {
                balls: 0,
                wickets: 0,
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

    get strikeRate() {
        return (this.batStats.runs / this.batStats.balls * 100).toPrecision(5)
    }

    get economy() {
        return (this.bowlStats.runs / this.bowlStats.balls * 6).toPrecision(3)
    }
}

module.exports = Player