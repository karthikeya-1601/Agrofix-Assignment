// db/index.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for some Neon.tech connections
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};