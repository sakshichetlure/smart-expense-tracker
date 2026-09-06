const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

router.post('/set', budgetController.setBudget);
router.post('/', budgetController.setBudget);
router.get('/status/:userId', budgetController.getBudgetStatus);
router.get("/mom-comparison/:userId", budgetController.getMoMComparison);

module.exports = router;