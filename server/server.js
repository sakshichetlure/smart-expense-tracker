const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();

// CORS Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Routes Registration
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

const budgetRoutes = require('./routes/budgetRoutes');
app.use('/api/budgets', budgetRoutes);

const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);

const recurringRoutes = require('./routes/recurringRoutes');
app.use('/api/recurring', recurringRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Environment & Database
process.env.JWT_SECRET = process.env.JWT_SECRET || "mysecrettokenkey12345";
const pool = require("./config/db");

// Health check / Root route
app.get('/', (req, res) => {
  res.send('Smart Expense Tracker Backend is Running!');
});

// Auto-create users table
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`)
.then(() => console.log("Users table verified/created successfully"))
.catch(err => console.error("Users table creation error:", err.message));

// Auto-create expenses table
pool.query(`
  CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'other',
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`)
.then(() => console.log("Expenses table verified/created successfully"))
.catch(err => console.error("Expenses table creation error:", err.message));

// Auto-create recurring expenses table
pool.query(`
  CREATE TABLE IF NOT EXISTS recurring_expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'other',
    frequency VARCHAR(50) DEFAULT 'monthly',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`)
.then(() => console.log("recurring_expenses table cleanly recreated"))
.catch(err => console.error("recurring_expenses table error:", err.message));

// Port listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});