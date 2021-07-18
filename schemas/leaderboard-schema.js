const mongoose = require('mongoose');

const leaderboardSchema = mongoose.Schema({
    summonerName: {
        type: String,
        required: true
    },
    tier: {
        type: String,
        required: true
    },
    division: {
        type: String,
        required: true
    },
    leaguePoints: {
        type: Number,
        required: true
    },
    pointValue: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('leaderboard', leaderboardSchema)
