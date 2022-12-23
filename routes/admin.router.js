const User = require('../models/user.model');
const router = require('express').Router();

router.post('/verify-user', async (req, res) => {
  const { adminID, targetID } = req.body;
  try {
    const admin = await User.findById(adminID);
    if (admin.role != 'Administrator') {
      return res
        .status(401)
        .json({ message: 'You are not an Administrator! Unauthorized!' });
    }
    const target = await User.findByIdAndUpdate(targetID, {
      paymentStatus: 'Verified'
    });
    const {
      _id: id,
      name,
      email,
      phone,
      role,
      paymentStatus,
      createdAt
    } = target;
    const resObj = { id, name, email, phone, role, paymentStatus, createdAt };
    return res.json(resObj);
  } catch (err) {
    return res.json(err);
  }
});

module.exports = router;
