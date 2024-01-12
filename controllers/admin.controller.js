const Team = require('../models/team.model');
const Tournament = require('../models/tournament.model');
const User = require('../models/user.model');
const makeUserObj = require('../utilities/makeUserObj');
const resError = require('../utilities/resError');

exports.getUsersController = async (req, res, next) => {
  try {
    const { pagination, filters } = req.body;
    let filterDoc = {};
    if (filters?.role) {
      filterDoc = filters;
    }
    const limit = pagination?.pageSize ? pagination.pageSize : 10;
    const skip = pagination?.current ? (pagination?.current - 1) * limit : 0;
    //  getting users
    const users = await User.find(filterDoc).skip(skip).limit(limit).sort(null);
    const totalUsers = await User.count();
    const data = users.map((user) => makeUserObj(user));
    res.json({ totalUsers, users: data });
  } catch (err) {
    return next(err);
  }
};

exports.createTournament = async (req, res, next) => {
  try {
    const newTournament = new Tournament({ creator: req.user.id, status: 'Open', ...req.body });
    const dbRes = await newTournament.save();
    res.json(dbRes);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getAllTournaments = async (req, res, next) => {
  // console.log('helo');
  // return;
  try {
    const dbRes = await Tournament.find()
      .sort({ createdAt: -1 })
      .populate({ path: 'creator', select: 'firstName lastName' });
    res.json(dbRes);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.adminForceRegistration = async (req, res, next) => {
  try {
    const { password, email, phone, remember, ...rest } = req.body;
    // if the user already exists
    const user = await User.find({ $or: [{ email }, { phone }] });
    if (user?._id) {
      return res.json(new resError('Email or phone Already Exists'));
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        return res.status(500).json(new resError('An unknown error occured on the server!'));
      }
      const newUser = new User({ ...rest, email, phone, hash });
      const dbRes = await newUser.save();
      req.user = dbRes;

      if (!req?.body?.remember) {
        return res.json(makeUserObj(dbRes));
      }
      // forwarding to issueCookie function
      // next();
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.verifyTeamController = async (req, res, next) => {
  try {
    const { team } = req.body;

    // console.log(team);
    // res.send(team);
    const dbRes = await Team.findByIdAndUpdate(team, { paymentStatus: 'Verified' });
    if (dbRes?._id) {
      const { tournament, pagination, filters } = req.body;
      let filterDoc = {};
      if (filters?.paymentStatus) {
        filterDoc.paymentStatus = filters.paymentStatus;
      } else if (filters?.teamType) {
        filterDoc.teamType = filters.teamType;
      }
      // console.log(filterDoc);
      const limit = pagination?.pageSize ? pagination.pageSize : 10;
      const skip = pagination?.current ? (pagination?.current - 1) * limit : 0;
      const teams = await Team.find({ tournament, ...filterDoc })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.json(teams);
    }
    res.json(new resError('Something went wrong'));
  } catch (err) {
    console.log(err.message);
    next(err);
  }
  // console.log(req.body);
};

exports.teamsController = async (req, res, next) => {
  // console.log(req.body);
  try {
    const { tournament, pagination, filters } = req.body;
    let filterDoc = {};
    if (filters?.paymentStatus) {
      filterDoc.paymentStatus = filters.paymentStatus;
    } else if (filters?.teamType) {
      filterDoc.teamType = filters.teamType;
    }
    // console.log(filterDoc);
    const limit = pagination?.pageSize ? pagination.pageSize : 10;
    const skip = pagination?.current ? (pagination?.current - 1) * limit : 0;
    const teams = await Team.find({ tournament, ...filterDoc })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalTeams = await Team.count();
    res.json({ totalTeams, teams });
    // console.log(teams);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

exports.handleSaveHomepage = (req, res, next) => {
  try {
    const { blocks } = req.body;
    console.log(blocks);
    setTimeout(() => {
      res.send(blocks);
    }, 2000);
  } catch (error) {
    next(error);
  }
};
