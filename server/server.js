const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();
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
  // Auto-create recurring, budgets, and plans tables
pool.query(`
  CREATE TABLE IF NOT EXISTS recurring_expenses (
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

  CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    monthly_limit NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_amount NUMERIC NOT NULL,
    saved_amount NUMERIC DEFAULT 0,
    target_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => console.log("All tables verified/created successfully"))
  .catch(err => console.error("Supporting tables error:", err.message));