const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    summonerName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('player', playerSchema);