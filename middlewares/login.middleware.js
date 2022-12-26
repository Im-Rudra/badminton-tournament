const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const makeUserObj = require('../utilities/makeUserObj');

exports.checkLoggedIn = async (req, res, next) => {
  const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  // if no cookies available
  if (!cookies) {
    const error = new Error('No cookies');
    error.status = 401;
    return next(error);
  }

  try {
    const token = cookies[process.env.COOKIE_NAME];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    const userObj = makeUserObj(user);
    console.log(userObj);
    res.json(userObj);
    res.end();
  } catch (err) {
    next(err);
  }
};
