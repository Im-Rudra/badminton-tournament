const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

passport.use(
  new LocalStrategy(async (emailOrPhone, password, done) => {
    try {
      const user = await User.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
      });
      if (!user) {
        return done(null, false, {
          message: 'Incorrect email or phone number'
        });
      }
      bcrypt.compare(password, user.hash, (err, result) => {
        if (err) {
          // const respMsg = new ResponseMsg(
          //   true,
          //   'Something broke on the server!'
          // );
          // return res.status(500).json(respMsg);
          return done(err);
        }
        //  if password don't match
        if (!result) {
          return done(null, false, { message: "Password didn't match!" });
          // const respMsg = new ResponseMsg(
          //   true,
          //   "Password Didn't match! Unauthorized"
          // );
          // return res.status(401).json(respMsg);
        }
        //  if everything is okey
        // return res.status(200).json(user);
        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  })
);

// create session id
// whenever we login it creares user id inside session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// find session info using session id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
