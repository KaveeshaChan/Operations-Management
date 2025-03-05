const express = require('express');
const { sql, poolPromise } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const crypto = require('crypto');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { generatePasswordResetEmail } = require('../controllers/emailHandlingControllers/utils/emailTemps')

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const pool = await poolPromise;
    
    // Modified query to include IsInitialLogin
    const result = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query(`
        SELECT 
          u.UserID, 
          u.PasswordHash, 
          u.RoleID, 
          r.RoleName,
          u.AgentID,
          u.IsInitialLogin 
        FROM Users u
        INNER JOIN Roles r ON u.RoleID = r.RoleID
        WHERE u.Email = @email
      `);

    const user = result.recordset[0];
    if (!user || !(await bcrypt.compare(password, user.PasswordHash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Create JWT token with additional flag
    const tokenPayload = { 
      userId: user.UserID,
      roleID: user.RoleID,
      roleName: user.RoleName,
      agentID: user.AgentID,
      requiresPasswordReset: user.IsInitialLogin
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    // Return both token and password reset flag
    res.json({ 
      token,
      requiresPasswordReset: user.IsInitialLogin,
      message: 'Login successful.' 
    });
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

router.post('/reset-password', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
  }

  const { newPassword } = req.body;

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decoded.userId;

      if (!userId) {
          return res.status(400).json({ message: 'Invalid token payload' });
      }

      const isForcedReset = decoded.requiresPasswordReset === true;

      const pool = await poolPromise;

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password, and only reset "IsInitialLogin" if this was a forced reset
      const query = `
          UPDATE Users 
          SET PasswordHash = @newPassword
              ${isForcedReset ? ', IsInitialLogin = 0' : ''}
          WHERE UserID = @userId
      `;

      await pool.request()
          .input('userId', sql.Int, userId)
          .input('newPassword', sql.VarChar, hashedPassword)
          .query(query);

      res.json({ message: 'Password updated successfully' });

  } catch (err) {
      console.error('Error during password reset:', err.message);
      res.status(401).json({ message: 'Invalid or expired token' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query('SELECT UserID FROM Users WHERE Email = @email');

    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user.UserID },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // // Send email with reset link
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: 'thirimadurasandun@gmail.com',
    //   // to: email,
    //   subject: 'Reset Your Cargo Connect Password',
    //   // html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    //   html: generatePasswordResetEmail ({
    //     email,
    //     resetLink
    //   })
    // });

    const emailPayload = {
      to: 'thirimadurasandun@gmail.com',
      // to: email,
      subject: 'Reset Your Cargo Connect Password',
      html: generatePasswordResetEmail ({
        email,
        resetToken
      })
    }

    // Send email (this could call your existing email API)
    const emailResponse = await fetch('http://localhost:5056/api/send-email/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });
    
    if (!emailResponse.ok) {
      throw new Error("Failed to send email notification");
    }

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Error:', err.message);

    if (err.message === "Failed to send email notification") {
        await transaction.rollback();
    }

    res.status(500).json({ message: 'Failed to add order or send email. ' + err.message });
}
});

module.exports = router;
