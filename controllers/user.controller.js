//  internal imports
const User = require('../models/user.model');
const ResponseMsg = require('../libs/responseMsg');
const makeUserObj = require('../utilities/makeUserObj');

//  external imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const makeError = require('../utilities/error');

require('dotenv').config();

const saltRounds = 10;

exports.registrationController = async (req, res, next) => {
  try {
    const { password, email, phone, ...rest } = req.body;
    // if the user already exists
    const user = await User.find({ $or: [{ email }, { phone }] });
    // const respMsg = new ResponseMsg(
    //   true,
    //   'Email or phone Already Exists, Use another Email And Phone'
    // );

    const error = makeError('Email or phone Already Exists', 403);
    if (user.length) {
      return next(error);
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        const respMsg = new ResponseMsg(true, 'An unknown error occured on the server!');
        return res.status(500).json(respMsg);
      }
      const newUser = new User({ ...rest, email, phone, hash, role: 'User' });
      const dbRes = await newUser.save();
      req.user = dbRes;
      next();
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.loginController = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone }] });

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      return next(error);
    }

    //  password matching
    const hashMatch = await bcrypt.compare(password, user.hash);

    //  if password is wrong
    if (!hashMatch) {
      const error = makeError('Wrong password!', 403);
      return next(error);
    }

    // const { _id: id, name } = user;

    // //  jwt public object
    // const jwtObj = { id, name, email: user?.email, phone: user?.phone };
    // const jwtToken = jwt.sign(jwtObj, process.env.JWT_SECRET, {
    //   expiresIn: process.env.JWT_EXPIRY
    // });

    // //  setting as signed cookie to the browser
    // res.cookie(process.env.COOKIE_NAME, jwtToken, {
    //   maxAge: process.env.COOKIE_EXPIRY,
    //   httpOnly: true,
    //   signed: true
    // });

    req.user = user;

    //  if everything is okey
    const resObj = makeUserObj(user);
    res.json(resObj);
    next();
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

exports.logoutController = async (req, res) => {
  try {
    res.clearCookie(process.env.COOKIE_NAME);
    res.json({ message: 'logout successful' });
  } catch (err) {
    console.log(err.message);
  }
};

exports.getLoggedInUser = async (req, res, next) => {
  const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  // if no cookies available
  if (!cookies) {
    return res.json(null).end();
  }

  try {
    const token = cookies[process.env.COOKIE_NAME];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      $and: [{ _id: decoded.id }, { email: decoded.email }, { phone: decoded.phone }]
    });

    const userObj = makeUserObj(user);
    res.json(userObj);
    res.end();
  } catch {
    res.json(null).end();
  }
};
