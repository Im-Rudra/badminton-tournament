const Homepage = require('../models/homepage.model');
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
    const { teamId, status } = req.body;

    // res.send(team);
    const dbRes = await Team.findByIdAndUpdate(
      teamId, 
      { paymentStatus: status }, 
      { new: true }
    );
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

      return res.json(teams);
    }
    return res.status(400).json({ error: 'Something went wrong' });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
  // console.log(req.body);
};

exports.teamsController = async (req, res, next) => {
  // console.log(req.body);
  try {
    const { tournamentId, pagination, filters } = req.body;

    const tournament = await Tournament
      .findById(tournamentId)
      .lean();
    
    const filterDoc = {};
    if (filters?.paymentStatus) {
      filterDoc.paymentStatus = filters.paymentStatus;
    } else if (filters?.teamType) {
      filterDoc.teamType = filters.teamType;
    }
    // console.log(filterDoc);
    const limit = pagination?.pageSize ? pagination.pageSize : 10;
    const skip = pagination?.current ? (pagination?.current - 1) * limit : 0;
    const teams = await Team.find({ tournament: tournamentId, ...filterDoc })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalTeams = await Team.count(filterDoc);
    res.json({ totalTeams, teams, tournament });
    // console.log(teams);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

exports.saveHomepage = async (req, res, next) => {
  try {
    const { id, blocks } = req.body;
    if (id) {
      const resp = await Homepage.findByIdAndUpdate(id, { blocks });
      return res.json(resp);
    }
    const newHomepage = new Homepage({ blocks });
    const response = await newHomepage.save({});
    if (response._id) {
      return res.json(response);
    }
  } catch (error) {
    next(error);
  }
};

exports.toggleTournamentStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!id) throw new Error('Wrong tournament id');
    const newTournament = await Tournament.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json(newTournament);
  } catch (error) {
    next(error);
  }
};
