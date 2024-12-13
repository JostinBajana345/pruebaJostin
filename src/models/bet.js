const mongoose = require('mongoose');


const betSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    result: { type: String, required: true },
    amount: { type: Number, required: true },
    odds: { type: Number, required: true },
    potentialWinnings: { type: Number, required: true },
});

module.exports = mongoose.model('Bet', betSchema);