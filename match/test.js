const Team = require('../models/Team')

const t = new Team('gcc', 'gc', [])
t.batStats.balls = 23
console.log(t.oversPlayed)