const jwt = require('jsonwebtoken');



const authenticate = (req, res, next) => {
  // Extract the token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Bu, token'leri imzalamak için kullanılan secret'la eşleşti mi kontrol et
    req.user = decoded; // Request'e decoded user bilgisini ekle
    next(); // Sıradaki middleware'e
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' }); // Invalid token olunca status code 401
  }
};

module.exports = authenticate;
