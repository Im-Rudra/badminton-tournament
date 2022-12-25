//  external requires
const express = require('express');

//  internal imports
const inputValidator = require('../validation');
const userAuth = require('../authentication/user.auth');
const moderatorAuth = require('../authentication/moderator.auth');
const makeUserObj = require('../utilities/makeUserObj');
const inputSchema = require('../validation/validationSchema');
const {
  registrationController,
  loginController,
  logoutController
} = require('../controllers/user.controller');
const { checkLoggedIn } = require('../middlewares/login.middleware');
const User = require('../models/user.model');
const { getUsersController } = require('../controllers/admin.controller');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('getting successfully');
});

//  protected route | admin and moderators can access this route
router.post('/getUsers', moderatorAuth, getUsersController);

router.post('/login', inputValidator(inputSchema.loginSchema), loginController);

router.post('/register', inputValidator(inputSchema.registerSchema), registrationController);

router.post('/logout', logoutController);

module.exports = router;
