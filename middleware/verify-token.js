const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Assign decoded payload to req.user
    req.user = decoded.payload;
    // Call next() to invoke the next middleware function
    next();
  } catch (error) {
    // If any errors, send back a 401 status and an 'Invalid token.' error message
    res.status(401).json({ error: 'Invalid token.' });
  }
}

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = verifyToken                                                                                                                                                                                                                                     
