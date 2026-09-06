require("dotenv").config();
const pool = require("./config/db");

async function seedPastMonths() {
  try {
    console.log("Adding historical data for August and July...");

    const sampleExpenses = [
      { user_id: 1, description: "Groceries Supermarket", amount: 3200, category: "Food", date: "2026-08-12" },
      { user_id: 1, description: "Fuel & Metro Pass", amount: 1800, category: "Travel", date: "2026-08-18" },
      { user_id: 1, description: "Summer Clothes Sale", amount: 2400, category: "Shopping", date: "2026-08-25" },
      { user_id: 1, description: "Dineout & Cafe", amount: 1950, category: "Food", date: "2026-07-10" },
      { user_id: 1, description: "Cab Rides", amount: 1500, category: "Travel", date: "2026-07-20" },
      { user_id: 1, description: "Books & Electronics", amount: 1200, category: "Shopping", date: "2026-07-28" }
    ];

    for (const item of sampleExpenses) {
      await pool.query(
        `INSERT INTO expenses (user_id, description, amount, category, date) VALUES ($1, $2, $3, $4, $5)`,
        [item.user_id, item.description, item.amount, item.category, item.date]
      );
    }

    console.log("Historical expense records inserted successfully!");
  } catch (err) {
    console.error("Error inserting past data:", err.message);
  } finally {
    pool.end();
  }
}

seedPastMonths();