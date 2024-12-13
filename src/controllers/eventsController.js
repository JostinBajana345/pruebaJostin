// const Event = require('../models/event');
const Bet = require('../models/bet');
// Obtener eventos
const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear evento
const createEvent = async (req, res) => {
    try {
        const { name, date, odds } = req.body;
        const newEvent = new Event({ name, date, odds });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Simular una apuesta
const simulateBet = (req, res) => {
    try {
        const { odds, betAmount, choice } = req.body;
        const probability = odds[choice];
        const result = Math.random() < 1 / probability ? 'win' : 'lose';
        const payout = result === 'win' ? betAmount * probability : 0;

        res.status(200).json({ result, payout });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Guardar apuesta
const saveBet = async (req, res) => {
    try {
        const { eventName, homeTeam, awayTeam, result, amount, odds, potentialWinnings } = req.body;

        const newBet = new Bet({
            eventName,
            homeTeam,
            awayTeam,
            result,
            amount,
            odds,
            potentialWinnings,
        });

        await newBet.save();
        res.status(201).json({ message: 'Apuesta guardada correctamente', bet: newBet });
    } catch (error) {
        console.error('Error al guardar la apuesta:', error);
        res.status(500).json({ message: 'Error al guardar la apuesta' });
    }
};





module.exports = { getEvents, createEvent, simulateBet, saveBet };
