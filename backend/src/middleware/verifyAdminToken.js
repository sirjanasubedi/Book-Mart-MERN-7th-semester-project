
require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log("Extracted Token:", token);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT verify failed:", err.message);
      return res.status(403).json({ message: 'Invalid credentials' });
    }

    console.log("Token Decoded:", user);

    if (user.role !== 'admin') {
      console.log("Not admin:", user.role);
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    req.user = user;
    next();
  });
};

module.exports = verifyAdminToken;



    