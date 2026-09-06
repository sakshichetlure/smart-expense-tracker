require("dotenv").config();
const db = require("./config/db");

async function createRecurringTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS recurring_expenses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      category VARCHAR(100) NOT NULL,
      frequency VARCHAR(50) DEFAULT 'monthly',
      start_date DATE NOT NULL DEFAULT CURRENT_DATE,
      next_due_date DATE NOT NULL,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(query);
    console.log("recurring_expenses table created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating table:", error);
    process.exit(1);
  }
}

createRecurringTable();