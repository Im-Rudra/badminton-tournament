//  external imports
const jwt = require('jsonwebtoken');

//  internal imports
const User = require('../models/user.model');
const makeError = require('../utilities/error');
const resError = require('../utilities/resError');

const checkAuth = (authSchema, authType) => async (req, res, next) => {
  try {
    const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    //  if no cookies available
    if (!cookies) {
      // const error = makeError('No cookies, Authorization failed!', 403);
      return res.status(403).json(new resError('Not logged in!'));
    }

    //  if auth cookie not available
    if (!cookies[process.env.COOKIE_NAME]) {
      // const error = makeError('Auth cookie unavailable, Authorization failed!', 403);
      return res.status(403).json(new resError('Not logged in! Authorization failed'));
    }

    const token = cookies[process.env.COOKIE_NAME];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      $and: [{ _id: decoded.id }, { email: decoded.email }, { phone: decoded.phone }]
    });

    //  if cookie token invalid
    if (!authSchema[authType]?.includes(user?.role)) {
      // const error = makeError('Not authorized for this request', 403);
      return res.status(403).json(new resError('Not authorized for this request'));
    }

    //  if everything ok
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkAuth;
