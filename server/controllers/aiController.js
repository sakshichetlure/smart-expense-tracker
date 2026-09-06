const db = require('../config/db');

exports.getInsights = async (req, res) => {
  try {
    const userId = req.params.userId || 1;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Fetch budget vs actual spent data
    const query = `
      SELECT 
        b.category,
        b.monthly_limit,
        COALESCE(SUM(e.amount), 0) AS total_spent
      FROM budgets b
      LEFT JOIN expenses e 
        ON LOWER(b.category) = LOWER(e.category) 
        AND b.user_id = e.user_id 
        AND EXTRACT(MONTH FROM e.date) = $2
        AND EXTRACT(YEAR FROM e.date) = $3
      WHERE b.user_id = $1 AND b.month = $2 AND b.year = $3
      GROUP BY b.category, b.monthly_limit;
    `;

    const { rows } = await db.query(query, [userId, currentMonth, currentYear]);

    const insights = [];

    rows.forEach((row) => {
      const spent = parseFloat(row.total_spent);
      const limit = parseFloat(row.monthly_limit);
      const ratio = limit > 0 ? spent / limit : 0;

      if (ratio >= 1.0) {
        insights.push({
          type: 'danger',
          title: `Overspending Alert in ${row.category}`,
          message: `You spent ₹${spent}, exceeding your ₹${limit} limit by ₹${(spent - limit).toFixed(0)}. Consider pausing ${row.category.toLowerCase()} purchases for the rest of the month.`
        });
      } else if (ratio >= 0.75) {
        insights.push({
          type: 'warning',
          title: `High Spending in ${row.category}`,
          message: `You have consumed ${(ratio * 100).toFixed(0)}% of your ${row.category} budget. Slow down daily expenditures to stay within limits.`
        });
      } else {
        insights.push({
          type: 'success',
          title: `Great Discipline on ${row.category}`,
          message: `Spending is well-controlled at only ${(ratio * 100).toFixed(0)}% of your ₹${limit} limit. Keep it up!`
        });
      }
    });

    if (insights.length === 0) {
      insights.push({
        type: 'info',
        title: 'Track More Expenses',
        message: 'Add more expenses this month to generate tailored AI financial recommendations.'
      });
    }

    res.json({ success: true, insights });
  } catch (error) {
    console.error("Error generating insights:", error);
    res.status(500).json({ error: error.message });
  }
};

 // Forecast upcoming expenses and handle What-If simulations
exports.getBudgetForecast = async (req, res) => {
  try {
    let userId = req.params.userId || 1;
    if (typeof userId === 'string') {
      userId = userId.replace(/[{}]/g, '');
    }

    const { savingsGoal = 0, cutCategory = null, cutPercent = 0 } = req.query;

    const historyQuery = `
      SELECT 
        category,
        COALESCE(ROUND(AVG(amount), 2), 0) AS avg_spent,
        COALESCE(SUM(amount), 0) AS total_spent
      FROM expenses
      WHERE user_id = $1
      GROUP BY category;
    `;

    const { rows } = await db.query(historyQuery, [userId]);

    let baselineForecastTotal = 0;
    const categoryProjections = rows.map((row) => {
      const avg = parseFloat(row.total_spent) || 0;
      baselineForecastTotal += avg;

      let simulatedAmount = avg;
      if (cutCategory && row.category.toLowerCase() === cutCategory.toLowerCase()) {
        simulatedAmount = avg * (1 - parseFloat(cutPercent) / 100);
      }

      return {
        category: row.category,
        historicalAvg: Math.round(avg),
        projectedNextMonth: Math.round(avg * 1.05),
        simulatedAmount: Math.round(simulatedAmount)
      };
    });

    const simulatedTotal = categoryProjections.reduce((sum, item) => sum + item.simulatedAmount, 0);
    const potentialMonthlySavings = Math.max(0, baselineForecastTotal - simulatedTotal);

    res.json({
      success: true,
      baselineForecastTotal: Math.round(baselineForecastTotal),
      simulatedTotal: Math.round(simulatedTotal),
      potentialMonthlySavings: Math.round(potentialMonthlySavings),
      targetSavingsGoal: parseFloat(savingsGoal),
      goalAchievable: potentialMonthlySavings >= parseFloat(savingsGoal),
      projections: categoryProjections
    });
  } catch (error) {
    console.error("Forecast Error:", error);
    res.status(500).json({ error: error.message });
  }
};