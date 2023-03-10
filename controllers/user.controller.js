//  internal imports
const User = require('../models/user.model');
const ResponseMsg = require('../libs/responseMsg');
const makeUserObj = require('../utilities/makeUserObj');
const makeError = require('../utilities/error');
const Tournament = require('../models/tournament.model');
const Team = require('../models/team.model');
const resError = require('../utilities/resError');

//  external imports
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

require('dotenv').config();

const saltRounds = 10;

exports.registrationController = async (req, res, next) => {
  try {
    const { password, email, phone, remember, ...rest } = req.body;
    // if the user already exists
    const user = await User.find({ $or: [{ email }, { phone }] });
    // const respMsg = new ResponseMsg(
    //   true,
    //   'Email or phone Already Exists, Use another Email And Phone'
    // );

    // const error = makeError('Email or phone Already Exists', 403);
    if (user.length) {
      return res.json(new resError('Email or phone Already Exists', 'repeated-credentials'));
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        // const respMsg = new ResponseMsg(true, 'An unknown error occured on the server!');
        return res
          .status(500)
          .json(new resError('Something went wrong on the server!', 'server-error'));
      }
      const newUser = new User({ ...rest, email, phone, hash });
      const dbRes = await newUser.save();
      req.user = dbRes;

      if (!req?.body?.remember) {
        return res.json(makeUserObj(dbRes));
      }

      // forwarding to issueCookie function
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
      return res.json(new resError('User not found!'));
    }

    //  password matching
    const hashMatch = await bcrypt.compare(password, user.hash);

    //  if password is wrong
    if (!hashMatch) {
      return res.json(new resError('Wrong password!'));
    }

    req.user = user;
    //  if remember = false then not issuing the cookie
    if (!req?.body?.remember) {
      return res.json(makeUserObj(user));
    }

    // forwording to the issueCookie function
    next();
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

exports.logoutController = async (req, res) => {
  try {
    res.clearCookie(process.env.COOKIE_NAME);
    res.json({ success: true, message: 'logout successful' });
  } catch (err) {
    console.log(err.message);
  }
};

exports.getLoggedInUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // console.log(authorization);

    //  if no cookies available
    if (!authorization) {
      return res.status(403).json(new resError('Not logged in!'));
    }

    const token = JSON.parse(authorization);
    // console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      $and: [{ _id: decoded.id }, { email: decoded.email }, { phone: decoded.phone }]
    });

    const userObj = makeUserObj(user);
    res.json(userObj);
  } catch (err) {
    console.log(err.message);
    next(err);
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
    if (!dbRes?._id) {
      return res.json(new resError('No Tournament Found!'));
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
      ...req.body,
      teamLeader: req.user._id,
      fullName_1: `${req.user.firstName} ${req.user.lastName}`,
      phone_1: req.user.phone
    };

    // { teamName: "sf", teamType: "Double", fullName_2: "sdf", phone_2: "1223456", tournament: "63bc8d6349a107cf2b953288" }

    // if (phone_2) {
    //   secondPlayer = await User.findOne({ email: req.body.secondPlayer });
    //   if (!secondPlayer?._id) {
    //     return res.json(new resError('Second player email not found!', 'create-new-user'));
    //   }
    //   dbDoc.secondPlayer = secondPlayer._id;
    // }
    // dbDoc.firstPlayer = req.user._id;
    const newTeam = new Team(dbDoc);
    const dbRes = await newTeam.save();

    const incrementDoc = { totalTeams: 1 };
    if (dbRes.teamType === 'Single') {
      incrementDoc.singleTeams = 1;
    } else if (dbRes.teamType === 'Double') {
      incrementDoc.doubleTeams = 1;
    }

    await Tournament.findByIdAndUpdate(tournament, { $inc: incrementDoc });

    res.json(dbRes);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.checkTeamRegistrablity = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { tournament: tournamentID } = req.body;

    const tournament = await Tournament.findById(tournamentID);
    // console.log(tournament);

    if (!tournament?._id) {
      return res
        .json(
          new resError("Tournament doesn't exist!", 'tournament-not-found', '/team-registration')
        )
        .status(404);
    } else if (tournament?.status === 'Closed') {
      return res
        .json(new resError('Tournament closed already', 'tournament-closed', '/team-registration'))
        .status(404);
    }

    const checkDoc = {
      $and: [
        { tournament: tournament },
        { teamLeader: req.user._id }
        // { $or: [{ phone_1: req.user._id }, { phone_2: req.user._id }] }
      ]
    };
    const checkData = await Team.find(checkDoc).sort({ createdAt: -1 });

    let verdictObj = _.countBy(checkData, (team) =>
      team.teamType === 'Single' ? 'Single' : 'Double'
    );
    // console.log(verdictObj);

    if (verdictObj.Single && verdictObj.Double) {
      return res.json(
        new resError('Team not registrable', 'team-not-registrable', '/team-registration')
      );
    }

    if (req.body.teamType) {
      const { teamType } = req.body;
      if (verdictObj[teamType]) {
        return res.json(
          new resError(`Not eligible for ${teamType} team`, 'not-eligible', '/team-registration')
        );
      }
    }

    if (Object.keys(verdictObj).length === 0) {
      verdictObj = null;
    }

    req.tournament = tournamentID;
    req.teamRegistrablityObj = verdictObj;

    if (!req.body.teamType) {
      return res.json(verdictObj);
    }

    if (req.body.teamType) {
      next();
    }
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};
