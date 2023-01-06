//  internal imports
const User = require('../models/user.model');
const ResponseMsg = require('../libs/responseMsg');
const makeUserObj = require('../utilities/makeUserObj');

//  external imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const makeError = require('../utilities/error');
const Tournament = require('../models/tournament.model');
const Team = require('../models/team.model');

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

    req.user = user;
    //  if remember = false then not issuing the cookie
    if (!req?.body?.remember) {
      return res.json(makeUserObj(user));
    }

    // directing to the issueCookie function
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

exports.getTournament = async (req, res, next) => {
  // console.log('helo');
  // return;
  try {
    const dbRes = await Tournament.findOne({ status: 'Open' })
      .sort({ createdAt: -1 })
      .limit(1)
      .populate({ path: 'creator', select: 'firstName lastName' });
    if (!dbRes._id) {
      return res.json({ success: false, message: 'No Tournament Found!' });
    }
    res.json(dbRes);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.teamRegistration = async (req, res, next) => {
  try {
    let { teamName, secondPlayer, tournament, teamType } = req.body;
    let dbDoc = {
      teamName,
      tournament,
      teamType
    };

    const tournamentData = await Tournament.findById(tournament);
    if (!tournamentData._id) {
      return res.json({ success: false, message: 'Tournament not found!' });
    } else if (tournamentData.status === 'Closed') {
      return res.json({ success: false, message: 'Tournament closed!' });
    }

    if (secondPlayer) {
      secondPlayer = await User.findOne({ email: req.body.secondPlayer });
      if (!secondPlayer._id) {
        return res.json({
          success: false,
          message: 'Second player email not found!',
          instruction: 'create-new-user'
        });
      }
      dbDoc.secondPlayer = secondPlayer._id;
    }
    dbDoc.firstPlayer = req.user._id;
    const newTeam = new Team(dbDoc);
    const dbRes = await newTeam.save();

    const incDoc = { totalTeams: 1 };
    if (dbRes.teamType === 'Single') {
      incDoc.singleTeams = 1;
    } else if (dbRes.teamType === 'Double') {
      incDoc.doubleTeams = 1;
    }

    await Tournament.findByIdAndUpdate(dbRes.tournament, { $inc: incDoc });
    res.json(dbRes);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
