//  internal imports
const User = require('../models/user.model');
const ResponseMsg = require('../libs/responseMsg');

//  external imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const saltRounds = 10;

exports.registrationController = async (req, res) => {
  try {
    const { password, email, phone, ...rest } = req.body;
    // if the user already exists
    const user = await User.find({ $or: [{ email }, { phone }] });
    const respMsg = new ResponseMsg(
      true,
      'Email or phone Already Exists, Use another Email And Phone'
    );
    if (user.length) {
      return res.status(409).json(respMsg);
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        const respMsg = new ResponseMsg(true, 'An unknown error occured on the server!');
        return res.status(500).json(respMsg);
      }
      const newUser = new User({ ...rest, email, phone, hash });
      await newUser.save();
      return res.status(201).json(newUser);
    });
  } catch (err) {
    console.log(err.message);
    return res.status(404).send(err.message);
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      const respMsg = new ResponseMsg(true, 'User Not found');
      return res.status(404).json(respMsg);
    }
    //  password matching
    const hashMatch = await bcrypt.compare(password, user.hash);
    //  if password is wrong
    if (!hashMatch) {
      const respMsg = new ResponseMsg(true, "Password Didn't match!");
      return res.json(respMsg);
    }
    const { _id: id, name, role, paymentStatus, createdAt } = user;
    const resObj = {
      id,
      name,
      email: user.email,
      phone: user.phone,
      role,
      paymentStatus,
      createdAt
    };
    //  jwt public object
    const jwtObj = { id, name, email };
    const jwtToken = jwt.sign(jwtObj, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY
    });
    //  setting as signed cookie to the browser
    res.cookie(process.env.COOKIE_NAME, jwtToken, {
      maxAge: process.env.COOKIE_EXPIRY,
      httpOnly: true,
      signed: true
    });
    //  if everything is okey
    res.json(resObj);
  } catch (error) {
    console.log(error.message);
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
