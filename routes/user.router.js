//  external requires
const express = require('express');

//  internal imports
const inputValidator = require('../validation');
const userAuth = require('../authentication/user.auth');
const moderatorAuth = require('../authentication/moderator.auth');
const inputSchema = require('../validation/validationSchema');
const {
  registrationController,
  loginController,
  logoutController,
  getLoggedInUser
} = require('../controllers/user.controller');
const { getUsersController } = require('../controllers/admin.controller');
const checkAuth = require('../authentication/auth');
const authSchema = require('../authentication/auth.schema');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('getting successfully');
});

router.post('/getLoggedinUser', getLoggedInUser);

//  protected route | admin and moderators can access this route
router.post('/getUsers', checkAuth(authSchema, 'Administrator'), getUsersController);

router.post('/login', inputValidator(inputSchema.loginSchema), loginController);

router.post('/register', inputValidator(inputSchema.registerSchema), registrationController);

router.post('/logout', logoutController);

module.exports = router;
