//  external imports
const jwt = require("jsonwebtoken");

//  internal imports
const User = require("../models/user.model");
const resError = require("../utilities/resError");

const checkAuth = (authType) => async (req, res, next) => {
  const authSchema = {
    Administrator: ["Administrator"],
    Moderator: ["Administrator", "Moderator"],
    User: ["Administrator", "Moderator", "User"],
  };

  try {
    const { authorization } = req.headers;

    //  if no cookies available
    if (!authorization) {
      return res.status(403).json(new resError("Not logged in!"));
    }

    const token = JSON.parse(authorization);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      $and: [
        { _id: decoded.id },
        { email: decoded.email },
        { phone: decoded.phone },
      ],
    });

    //  if cookie token invalid
    if (!authSchema[authType]?.includes(user?.role)) {
      // const error = makeError('Not authorized for this request', 403);
      return res
        .status(403)
        .json(new resError("Not authorized for this request".i));
    }
    // console.log(authorization);

    //  if everything ok
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = checkAuth;
