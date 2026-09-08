const db = require('../config/db');

exports.setBudget = async (req, res) => {
  try {
    const { category, userId } = req.body;
    // Frontend nunchi monthlyLimit vachina leda limit vachina handle chesthundi
    const limitAmount = req.body.monthlyLimit || req.body.limit;
    
    // Month & Year automatically current date nunchi theeskuntundi
    const now = new Date();
    const month = req.body.month || (now.getMonth() + 1);
    const year = req.body.year || now.getFullYear();

    // Mundhe budget unte UPDATE chesthundi, lekapothe INSERT chesthundi
    const checkQuery = `
      SELECT id FROM budgets 
      WHERE user_id = $1 AND LOWER(category) = LOWER($2) AND month = $3 AND year = $4
    `;
    const existing = await db.query(checkQuery, [userId, category, month, year]);

    let savedBudget;
    if (existing.rows.length > 0) {
      const updateQuery = `
        UPDATE budgets 
        SET monthly_limit = $1 
        WHERE id = $2 
        RETURNING *;
      `;
      const result = await db.query(updateQuery, [limitAmount, existing.rows[0].id]);
      savedBudget = result.rows[0];
    } else {
      const insertQuery = `
        INSERT INTO budgets (user_id, category, monthly_limit, month, year)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const result = await db.query(insertQuery, [userId, category, limitAmount, month, year]);
      savedBudget = result.rows[0];
    }

    res.status(200).json({ success: true, budget: savedBudget });
  } catch (error) {
    console.error("Budget save error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getBudgetStatus = async (req, res) => {
  try {
    const userId = req.params.userId || req.query.userId;
if (!userId || userId === 'undefined' || userId === 'null') {
  return res.json([]);
}
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

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

    const statusReport = rows.map((item) => {
      const spent = parseFloat(item.total_spent);
      const limit = parseFloat(item.monthly_limit);
      const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
      
      let alertLevel = 'normal';
      let message = 'Within budget';

      if (percentage >= 100) {
        alertLevel = 'danger';
        message = `Budget exceeded!`;
      } else if (percentage >= 80) {
        alertLevel = 'warning';
        message = `Warning: ${percentage}% used!`;
      }

      return {
        category: item.category,
        limit,
        spent,
        percentage,
        alertLevel,
        message
      };
    });

    res.json(statusReport);
  } catch (error) {
    console.error("Budget status error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 1. Export filtered transactions as CSV
  const exportToCSV = () => {
    if (!filteredExpenses || filteredExpenses.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["ID", "Category", "Description", "Amount (INR)", "Date"];
    const rows = filteredExpenses.map((exp) => [
      exp.id,
      `"${exp.category || "Uncategorized"}"`,
      `"${exp.title || exp.description || "N/A"}"`,
      exp.amount,
      `"${new Date(exp.created_at || exp.date).toLocaleDateString("en-IN")}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Monthly_Expense_Report_${new Date().toISOString().slice(0, 7)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Export filtered transactions as a styled PDF report
  const exportToPDF = () => {
    if (!filteredExpenses || filteredExpenses.length === 0) {
      alert("No data available to export.");
      return;
    }

    const doc = new jsPDF();

    // Title & Metadata
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text("Smart Expense Tracker - Monthly Statement", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 28);
    doc.text(`Total Records: ${filteredExpenses.length}`, 14, 34);

    const totalAmount = filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Spending: INR ${totalAmount.toFixed(2)}`, 14, 42);

    // Table
    const tableColumns = ["Category", "Description", "Date", "Amount (INR)"];
    const tableRows = filteredExpenses.map((exp) => [
      exp.category || "General",
      exp.title || exp.description || "-",
      new Date(exp.created_at || exp.date).toLocaleDateString("en-IN"),
      `Rs. ${Number(exp.amount).toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 48,
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 9 }
    });

    doc.save(`Monthly_Report_${new Date().toISOString().slice(0, 7)}.pdf`);
  };


  exports.getMoMComparison = async (req, res) => {
  try {
    let userId = req.params.userId || 1;
    if (typeof userId === 'string') {
      userId = userId.replace(/[{}]/g, '');
    }

    const query = `
      SELECT 
        TO_CHAR(COALESCE(date, created_at), 'YYYY-MM') AS month_key,
        TO_CHAR(COALESCE(date, created_at), 'Mon YYYY') AS month_label,
        COALESCE(SUM(amount), 0) AS total_spent
      FROM expenses
      WHERE user_id = $1
      GROUP BY month_key, month_label
      ORDER BY month_key DESC
      LIMIT 6;
    `;

    const { rows } = await db.query(query, [userId]);
    const chronologicalData = [...rows].reverse();

    let previousSpent = null;
    const defaultMonthlyBudget = 10000;
    let accumulatedRollover = 0;

    const report = chronologicalData.map((item) => {
      const spent = parseFloat(item.total_spent);
      let changePercent = 0;

      if (previousSpent !== null && previousSpent > 0) {
        changePercent = (((spent - previousSpent) / previousSpent) * 100).toFixed(1);
      }

      const effectiveBudget = defaultMonthlyBudget + accumulatedRollover;
      const netSavings = effectiveBudget - spent;
      const surplusCarried = netSavings > 0 ? netSavings : 0;
      accumulatedRollover = surplusCarried;

      previousSpent = spent;

      return {
        month: item.month_label,
        spent: Math.round(spent),
        budget: effectiveBudget,
        changePercent: Number(changePercent),
        surplusCarried: Math.round(surplusCarried),
        status: spent > effectiveBudget ? "Exceeded" : "Under Budget"
      };
    });

    res.json({ success: true, comparison: report });
  } catch (error) {
    console.error("MoM Comparison Error:", error);
    res.status(500).json({ error: error.message });
  }
};