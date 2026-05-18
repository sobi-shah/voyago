const express = require('express');
const router = express.Router();
const { planTrip } = require('../controllers/tripPlannerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', planTrip);

module.exports = router;
