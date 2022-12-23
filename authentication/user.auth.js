//  external imports
const jwt = require('jsonwebtoken');

//  internal imports
const { signedCookie } = require('cookie-parser');
const ResponseMsg = require('../libs/responseMsg');
const User = require('../models/user.model');

const userAuth = async (req, res, next) => {
  const cookies = Object.keys(req, signedCookie).length > 0 ? req.signedCookie : null;
  //  if no cookies available
  if (!cookies) {
    const errMsg = new ResponseMsg(true, 'No cookies, Authorization failed!');
    return next(errMsg);
  }
  //  if auth cookie not available
  if (!cookies[process.env.COOKIE_NAME]) {
    const errMsg = new ResponseMsg(true, 'Auth cookie unavailable, Authorization failed!');
    return next(errMsg);
  }
  try {
    const token = cookies[process.env.COOKIE_NAME];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      $and: [{ _id: decoded.id }, { email: decoded.email }, { phone: decoded.phone }]
    });
    //  if cookie token invalid
    if (!user?.id) {
      const errMsg = new ResponseMsg(true, 'Not a valid cookie, authorization failed!');
      return next(errMsg);
    }
    //  if everything ok
    req.user = user;
    return next();
  } catch (err) {
    next(err.message);
  }
};

userAuth();

module.exports = userAuth;
