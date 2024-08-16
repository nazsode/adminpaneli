const jwt = require('jsonwebtoken');



const authenticate = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure this matches the secret used for signing tokens
    req.user = decoded; // Attach decoded user info to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' }); // Changed status code to 401 for invalid tokens
  }
};

module.exports = authenticate;
