require('dotenv').config();
const sql = require('mssql');

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true, 
  },
};

// Connect to the database
const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log('Connected to the SQL Server database');
    return pool;
  })
  .catch((err) => {
    console.error('Database Connection Failed:', err.message);
    process.exit(1);
  });

module.exports = {
  sql,
  poolPromise,
};
