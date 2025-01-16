const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const bcrypt = require('bcryptjs');
const { getAllFromUsers, mainUserRegistration } = require('../../auth/queries/mainUserRegistrationQuery');

const router = express.Router();

// Register Route
router.post('/', async (req, res) => {
  const { name, email, contactNumber, password } = req.body;

  if (!email || !password || !name || !contactNumber) {
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
      const errorResponse = { error: 'Email already in use.' };
      console.log('Response:', errorResponse);
      return res.status(409).json(errorResponse);
    }

    // Insert user into the database
    await pool
      .request()
      .input('Main_User_Name', sql.VarChar, name)
      .input('ContactNumber', sql.VarChar, contactNumber)
      .input('Email', sql.VarChar, email)
      .input('PasswordHash', sql.VarChar, hashedPassword)
      .query(mainUserRegistration);

    const successResponse = { message: 'User registered successfully.' };
    res.status(201).json(successResponse);
  } catch (err) {
    const errorResponse = { error: 'Internal Server Error.' };
    console.error('Error:', err.message);
    console.log('Response:', errorResponse);
    res.status(500).json(errorResponse);
  }
});

module.exports = router;
