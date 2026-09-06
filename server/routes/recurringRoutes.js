const express = require("express");
const router = express.Router();
const recurringController = require("../controllers/recurringController");

router.get("/", recurringController.getRecurringExpenses);
router.post("/", recurringController.addRecurringExpense);
router.delete("/:id", recurringController.deleteRecurringExpense);

module.exports = router;