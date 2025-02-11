const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authorizeRoles = (allowedRoles) => (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Extract token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode token
    // console.log('Decoded Token:', decoded); // Log token payload for debugging

    req.user = decoded; // Attach user info to the request object

    // Check if the user's role is allowed
    if (!allowedRoles.includes(decoded.roleName)) {
      return res.status(403).json({ message: 'Access denied. You do not have the required permissions.' });
    }

    next(); // Token is valid, proceed to the route handler
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token blacklist
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const pool = await poolPromise;
    const result = await pool.request()
      .input('tokenHash', sql.VarChar, tokenHash)
      .query('SELECT 1 FROM TokenBlacklist WHERE TokenHash = @tokenHash');
    
    if (result.recordset.length > 0) {
      return res.status(401).json({ message: 'Token has been invalidated.' });
    }
    // Attach user to request
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' });
    }
    res.status(401).json({ message: 'Invalid token.' });
  }
}

module.exports = { authorizeRoles, authMiddleware };