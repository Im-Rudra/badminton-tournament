const Tournament = require('../models/tournament.model');
const User = require('../models/user.model');
const makeUserObj = require('../utilities/makeUserObj');

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
    // console.log(newTournament);
    const dbRes = await newTournament.save();
    res.json(dbRes);
    // res.json(req.body);
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
