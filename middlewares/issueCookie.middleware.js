const jwt = require('jsonwebtoken');
const makeUserObj = require('../utilities/makeUserObj');

const issueCookie = (req, res, next) => {
  try {
    if (!req.user._id) {
      return;
    }
    const { _id: id, email, phone } = req.user;

    const jwtObj = { id, email, phone };
    const jwtToken = jwt.sign(jwtObj, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY
    });

    //  setting as signed cookie to the browser
    res.cookie(process.env.COOKIE_NAME, jwtToken, {
      maxAge: process.env.COOKIE_EXPIRY,
      httpOnly: true,
      signed: true,
      sameSite: 'none',
      secure: true
    });

    res.status(201).json(makeUserObj(req.user));
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = issueCookie;
