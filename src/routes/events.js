const express = require('express');
const { getEvents, createEvent, simulateBet, saveBet } = require('../controllers/eventsController');

const router = express.Router();

router.get('/', getEvents);
router.post('/', createEvent);
router.post('/bet', saveBet);
router.post('/simulate', simulateBet);

module.exports = router;
