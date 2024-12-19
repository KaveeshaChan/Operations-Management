const express = require('express');
const { sql, poolPromise } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const pool = await poolPromise; // Get the database connection
    const result = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE Email = @email');

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isValid = await bcrypt.compare(password, user.PasswordHash);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign(
      { userId: user.UserID, roleID: user.RoleID },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, message: 'Login successful.' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

module.exports = router;
