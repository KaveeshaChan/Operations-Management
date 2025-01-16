const jwt = require('jsonwebtoken');

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

module.exports = { authorizeRoles };