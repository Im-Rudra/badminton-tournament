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
    const users = await User.find(filterDoc).skip(skip).limit(limit);
    const totalUsers = await User.count();
    const data = users.map((user) => makeUserObj(user));
    res.json({ totalUsers, users: data });
  } catch (err) {
    return next(err);
  }
};
