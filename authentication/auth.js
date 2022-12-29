//  external imports
const jwt = require('jsonwebtoken');

//  internal imports
const User = require('../models/user.model');
const makeError = require('../utilities/error');

const checkAuth = (authSchema, authType) => async (req, res, next) => {
  const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  //  if no cookies available
  if (!cookies) {
    const error = makeError('No cookies, Authorization failed!', 403);
    return next(error);
  }

  //  if auth cookie not available
  if (!cookies[process.env.COOKIE_NAME]) {
    const error = makeError('Auth cookie unavailable, Authorization failed!', 403);
    return next(error);
  }

  try {
    const token = cookies[process.env.COOKIE_NAME];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      $and: [{ _id: decoded.id }, { email: decoded.email }, { phone: decoded.phone }]
    });

    //  if cookie token invalid

    if (!authSchema[authType]?.includes(user?.role)) {
      const error = makeError('Not a valid cookie, authorization failed!', 403);
      return next(error);
    }

    //  if everything ok
    req.user = user;
    return next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkAuth;
