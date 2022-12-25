//  external imports
const jwt = require('jsonwebtoken');

//  internal imports
const User = require('../models/user.model');

const moderatorAuth = async (req, _res, next) => {
  const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  //  if no cookies available
  if (!cookies) {
    return next('No cookies! Authorization failed!');
  }

  //  if auth cookie not available
  if (!cookies[process.env.COOKIE_NAME]) {
    return next('Auth cookie unavailable! Authorization failed!');
  }
  try {
    //  verification of token
    const token = cookies[process.env.COOKIE_NAME];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  token info verification
    const user = await User.findOne({
      $and: [{ _id: decoded.id }, { email: decoded.email }, { phone: decoded.phone }]
    });

    //  if not an admin or moderator
    if (!['Administrator', 'Moderator'].includes(user.role)) {
      return next('Not an admin or moderator! Authorization failed!');
    }

    //  if everything okey
    req.user = user;
    return next();
  } catch (err) {
    next(err);
  }
};

module.exports = moderatorAuth;
