const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.checkLoggedIn = async (req, res, next) => {
  const cookies = req.signedCookies;
  const hasCookie = Object.keys(req.signedCookies).length > 0;
  if (!hasCookie) {
    return next();
  }
  try {
    const token = cookies[process.env.COOKIE_NAME];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    const { _id: id, name, email, phone, role, createdAt } = user;
    const resObj = {
      id,
      name,
      email,
      phone,
      role,
      createdAt
    };
    res.json(resObj);
  } catch (err) {
    next();
  }
};
