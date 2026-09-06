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
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const aiRoutes = require('./routes/aiRoutes');
const recurringRoutes = require('./routes/recurringRoutes');
const authMiddleware = require('./middleware/auth');
app.use(cors());
app.use(express.json()); // reads json data

// test route
app.get('/', async (req, res) => {
    res.send("API running...");
});

// use routes
app.use('/api', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/recurring', recurringRoutes);
// create a proctored route
app.get('/api/dashboard', authMiddleware, (req, res) => {
    res.json({
        message: "Welcome to dashboard",
        user: req.user
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});