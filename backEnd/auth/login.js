const express = require('express');
const { sql, poolPromise } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for email: ${email}`);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const pool = await poolPromise; // Get the database connection

    // Query to join Users table with Roles table to get RoleName
    const result = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query(`
        SELECT 
          u.UserID, 
          u.PasswordHash, 
          u.RoleID, 
          r.RoleName,
          u.AgentID 
        FROM Users u
        INNER JOIN Roles r ON u.RoleID = r.RoleID
        WHERE u.Email = @email
      `);

    const user = result.recordset[0];
    if (!user || !(await bcrypt.compare(password, user.PasswordHash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user.UserID, roleID: user.RoleID, roleName: user.RoleName, agentID: user.agentID },
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
