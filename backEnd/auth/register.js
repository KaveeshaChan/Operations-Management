const express = require('express');
const { sql, poolPromise } = require('../config/database');
const bcrypt = require('bcryptjs');
const { getAllFromUsers, userRegistration } = require('./queries/registerQuery');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { User_Contact_Number, email, password, Freight_Agent, roleName } = req.body;
  console.log(req.body);

  if (!email || !password || !roleName) {
    return res.status(400).json({ error: 'Email, password, and role name are required.' });
  }

  try {
    const pool = await poolPromise; // Await the resolved poolPromise
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the email already exists
    const existingUser = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query(getAllFromUsers);

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    // Insert user into the database
    await pool
      .request()
      .input('User_Contact_Number', sql.VarChar, User_Contact_Number)
      .input('email', sql.VarChar, email)
      .input('hashedPassword', sql.VarChar, hashedPassword)
      .input('Freight_Agent', sql.VarChar, Freight_Agent)
      .input('roleName', sql.VarChar, roleName)
      .query(userRegistration);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
});

module.exports = router;
