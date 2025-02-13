const express = require('express');
const { sql, poolPromise } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const crypto = require('crypto');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

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
      { userId: user.UserID, roleID: user.RoleID, roleName: user.RoleName, agentID: user.AgentID },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, message: 'Login successful.' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

router.post('/logout', authMiddleware, async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required.' });
  }
  const token = authHeader.split(' ')[1];

  try{
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    // Convert JWT expiration time (seconds) to Date
    const expiration = new Date(req.user.exp * 1000);

    const pool = await poolPromise;
    await pool.request()
      .input('tokenHash', sql.VarChar, tokenHash)
      .input('expiration', sql.DateTime, expiration)
      .query('INSERT INTO TokenBlacklist (TokenHash, ExpirationDateTime) VALUES (@tokenHash, @expiration)');
    
    res.status(200).json({ message: 'Successfully logged out.' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Internal server error during logout.' });
  }
})

module.exports = router;
