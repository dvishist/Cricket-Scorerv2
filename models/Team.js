class Team {

    constructor(name, short, playerList) {
        this.name = name
        this.short = short
        this.playerList = playerList

        this.batStats = {
            runs: 0,
            wickets: 0,
            balls: 0,
            fours: 0,
            sixes: 0
        }

        this.extras = {
            wides: 0,
            noBalls: 0,
            byes: 0,
            legByes: 0,
            penalties: 0
        }

        this.playerList.forEach(player => {
            if (player.name.includes('#C')) {
                player.name = player.name.replace('#C', '')
                this.captain = player
            }
            if (player.name.includes('#WK')) {
                player.name = player.name.replace('#WK', '')
                this.wk = player
            }
            player.name = player.name.trim()
        });
    }

    //returns a String representing overs eg:2.5 being 17balls
    getOversPlayed() {
        return Math.trunc(this.batStats.balls / 6).toString() + '.' + (this.batStats.balls % 6).toString()
    }

}

module.exports = Team