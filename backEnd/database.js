const sql = require('mssql');
require('dotenv').config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: true, // Change if necessary
  },
};

async function connectDB() {
  try {
    await sql.connect(sqlConfig);
    console.log('Connected to the database.');
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
}

module.exports = { connectDB };
