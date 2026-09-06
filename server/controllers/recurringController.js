const db = require("../config/db");

// Get all recurring expenses
exports.getRecurringExpenses = async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const result = await db.query(
      "SELECT * FROM recurring_expenses WHERE user_id = $1 ORDER BY next_due_date ASC",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching recurring expenses:", error);
    res.status(500).json({ error: "Server error fetching recurring expenses" });
  }
};

// Add new recurring expense
exports.addRecurringExpense = async (req, res) => {
  const { title, amount, category, frequency, next_due_date } = req.body;
  const userId = req.user?.id || 1;

  if (!title || !amount || !category || !next_due_date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await db.query(
      `INSERT INTO recurring_expenses (user_id, title, amount, category, frequency, next_due_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, title, amount, category, frequency || "monthly", next_due_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating recurring expense:", error);
    res.status(500).json({ error: "Server error saving recurring expense" });
  }
};

// Delete a recurring expense
exports.deleteRecurringExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || 1;

  try {
    await db.query("DELETE FROM recurring_expenses WHERE id = $1 AND user_id = $2", [id, userId]);
    res.json({ message: "Recurring expense removed" });
  } catch (error) {
    console.error("Error deleting recurring expense:", error);
    res.status(500).json({ error: "Server error deleting recurring expense" });
  }
};