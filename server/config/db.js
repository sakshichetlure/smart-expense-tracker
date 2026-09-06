const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
      }
);

// Test connection on startup
pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    } else {
        console.log('Database connected successfully');
        release();
    }
});

module.exports = pool;