require("dotenv").config();
const pool = require("./config/db");

async function addOverspend() {
  try {
    await pool.query(
      `INSERT INTO expenses (user_id, description, amount, category, date) 
       VALUES ($1, $2, $3, $4, $5)`,
      [1, "Buffet Party Dinner", 3500, "Food", "2026-09-06"]
    );
    console.log("SUCCESS: Food expense added and threshold breached!");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    pool.end();
  }
}

addOverspend();