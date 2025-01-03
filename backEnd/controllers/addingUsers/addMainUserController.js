const express = require('express');
const { sql, poolPromise } = require('../config/database');
const bcrypt = require('bcryptjs');
const { getAllFromUsers, mainUserRegistration } = require('../../auth/queries/mainUserRegistrationQuery');

const router = express.Router();

// Register Route
router.post('/addMainUser', async (req, res) => {
  const { Main_User_Name, email, User_Contact_Number, password } = req.body;
  console.log(req.body);

  if (!email || !password || !Main_User_Name || !User_Contact_Number) {
    return res.status(400).json({ error: 'Email, password, username and contact number are required.' });
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
      .input('Main_User_Name', sql.VarChar, Main_User_Name)
      .input('ContactNumber', sql.VarChar, User_Contact_Number)
      .input('Email', sql.VarChar, email)
      .input('hashedPassword', sql.VarChar, hashedPassword)
      .query(mainUserRegistration);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
});

module.exports = router;
