const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(cors({
  origin: '*',
  credentials: true
}));
process.env.JWT_SECRET = process.env.JWT_SECRET || "mysecrettokenkey12345";
const pool = require("./config/db");

// Auto-create users table on startup
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => console.log("Users table verified/created successfully"))
  .catch(err => console.error("Table creation error:", err.message));
  // Auto-create expenses table
pool.query(`
  CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    category VARCHAR(255) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => console.log("Expenses table verified/created successfully"))
  .catch(err => console.error("Expenses table creation error:", err.message));
  // Auto-create expenses table
pool.query(`
  CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    category VARCHAR(255) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => console.log("Expenses table verified/created successfully"))
  .catch(err => console.error("Expenses table creation error:", err.message));

// Drop and recreate recurring_expenses table cleanly
pool.query(`
  DROP TABLE IF EXISTS recurring_expenses;
  CREATE TABLE recurring_expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Other',
    frequency VARCHAR(50) DEFAULT 'monthly',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => console.log("recurring_expenses table cleanly recreated"))
  .catch(err => console.error("Recurring table recreation error:", err.message));

const authRoutes = require('./routes/authRoutes');
// Drop old incomplete recurring table and recreate
pool.query(`
  DROP TABLE IF EXISTS recurring_expenses;
  CREATE TABLE recurring_expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Other',
    frequency VARCHAR(50) DEFAULT 'monthly',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => console.log("recurring_expenses table cleanly recreated"))
  .catch(err => console.error("Recurring table recreation error:", err.message));
  const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});