const express = require('express');
const app = express();
const cors = require("cors");

require("dotenv").config();

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const aiRoutes = require('./routes/aiRoutes');
const recurringRoutes = require('./routes/recurringRoutes');
const authMiddleware = require('./middleware/auth');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

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