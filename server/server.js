const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const recurringRoutes = require('./routes/recurringRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Smart Expense Tracker API is running');
});

// Database connection check & Table auto-creation
pool.connect()
  .then(client => {
    console.log('Database connected successfully');
    client.release();
  })
  .catch(err => console.error('Database connection error:', err.message));

// Create users table
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => console.log('Users table verified/created successfully'))
  .catch(err => console.error('Users table error:', err.message));

// Create expenses table
pool.query(`
  CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => console.log('Expenses table verified/created successfully'))
  .catch(err => console.error('Expenses table error:', err.message));

// Create recurring_expenses table
pool.query(`
  CREATE TABLE IF NOT EXISTS recurring_expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    frequency VARCHAR(50) DEFAULT 'monthly',
    start_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => console.log('recurring_expenses table cleanly recreated'))
  .catch(err => console.error('recurring_expenses table error:', err.message));
// Create budgets table and add missing columns
pool.query(`
  CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    month INTEGER NOT NULL DEFAULT EXTRACT(MONTH FROM CURRENT_DATE),
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ALTER TABLE budgets ADD COLUMN IF NOT EXISTS month INTEGER NOT NULL DEFAULT EXTRACT(MONTH FROM CURRENT_DATE);
  ALTER TABLE budgets ADD COLUMN IF NOT EXISTS year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE);
`).then(() => console.log('Budgets table & columns verified successfully'))
  .catch(err => console.error('Budgets table error:', err.message));
// Seed historical past data for userId 1
const seedPastExpenses = async () => {
  try {
    const check = await pool.query("SELECT COUNT(*) FROM expenses WHERE user_id = 1 AND date < '2026-09-01'");
    if (parseInt(check.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO expenses (user_id, description, amount, category, date) VALUES
        (1, 'Groceries & Provisions', 4200, 'Food', '2026-07-10'),
        (1, 'Electricity & Utilities', 2100, 'Bills', '2026-07-15'),
        (1, 'Fuel & Transit', 1800, 'Transport', '2026-07-22'),
        (1, 'Weekend Dining', 2500, 'Food', '2026-08-05'),
        (1, 'Internet Bill', 1200, 'Bills', '2026-08-12'),
        (1, 'Cab & Metro', 1600, 'Transport', '2026-08-20'),
        (1, 'Shopping & Clothes', 3400, 'Shopping', '2026-08-25');
      `);
      console.log('Historical expense records seeded successfully into live DB!');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};
seedPastExpenses();
// Log users to see valid accounts
pool.query("SELECT id, name, email FROM users").then(res => {
  console.log("=== REGISTERED USERS ===");
  console.table(res.rows);
}).catch(err => console.error("Users fetch error:", err.message));

// Port listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});