class Team {
    constructor(name, short, playerList) {
        this.name = name
        this.short = short
        this.playerList = playerList

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
}

module.exports = Team