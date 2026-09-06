const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/insights/:userId', aiController.getInsights);
router.get('/forecast/:userId', aiController.getBudgetForecast);

module.exports = router;