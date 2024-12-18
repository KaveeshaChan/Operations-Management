const authorize = (allowedRoles) => {
    return (req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(403).json({ message: 'Access denied.' });
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!allowedRoles.includes(decoded.roleID)) {
          return res.status(403).json({ message: 'You do not have permission to access this page.' });
        }
        req.user = decoded;
        next();
      } catch (err) {
        res.status(403).json({ message: 'Invalid token.' });
      }
    };
  };
  