const pool = require("../config/db");

async function createUsersTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("SUCCESS: users table created successfully!");
  } catch (err) {
    console.error("ERROR creating users table:", err.message);
  } finally {
    pool.end();
  }
}

createUsersTable();