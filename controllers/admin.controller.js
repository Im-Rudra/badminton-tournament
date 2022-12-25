const User = require('../models/user.model');
const makeUserObj = require('../utilities/makeUserObj');

exports.verificationController = async (req, res) => {
  const { adminID, targetID } = req.body;
  try {
    // const admin = await User.findById(adminID);
    // if (admin.role !== 'Administrator') {
    //   return res.status(401).json({ message: 'You are not an Administrator! Unauthorized!' });
    // }
    const target = await User.findByIdAndUpdate(targetID, {
      paymentStatus: 'Verified'
    });
    const { _id: id, name, email, phone, role, paymentStatus, createdAt } = target;
    const resObj = { id, name, email, phone, role, paymentStatus, createdAt };
    return res.json(resObj);
  } catch (err) {
    return res.json(err);
  }
};

exports.getUsersController = async (req, res) => {
  const { pagination, filters } = req.body;
  let filterDoc = {};
  if (filters?.role) {
    filterDoc = filters;
  }
  const limit = pagination.pageSize || 10;
  const skip = (pagination.current - 1) * limit || 0;
  const users = await User.find(filterDoc).skip(skip).limit(limit);
  const totalUsers = await User.count();
  const data = users.map((user) => makeUserObj(user));
  res.json({ totalUsers, users: data });
};
