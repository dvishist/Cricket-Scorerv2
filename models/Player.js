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
                maidens: 0
            },
            this.fieldStats = {
                catches: 0,
                runouts: 0,
                stumpings: 0
            },
            this.wicket = {
                out: false,
                //methods: bowled, lbw, caught, runout, obstruction, retired
                method: null,
                bowler: null,
                fielder: null
            }
    }
}

module.exports = Player