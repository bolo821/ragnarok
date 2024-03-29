const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
      if (error || !decoded) {
        return res.status(405).json({ msg: 'Token is not valid' });
      } else {
        User.findOne({ account_id: decoded.user.account_id }, async (err, user) => {
          if (err) {
            return res.status(405).json({ msg: 'Error in finding user' });
          } else if (!user) {
            return res.status(401).json({ msg: 'User not exist' });
          } else {
            req.user = decoded.user;
            next();
          }
        });
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};
