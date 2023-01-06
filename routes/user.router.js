//  external requires
const express = require('express');

//  internal imports
const inputValidator = require('../validation');
const inputSchema = require('../validation/validationSchema');
const {
  registrationController,
  loginController,
  logoutController,
  getLoggedInUser,
  getTournament,
  teamRegistration
} = require('../controllers/user.controller');
const { getUsersController } = require('../controllers/admin.controller');
const checkAuth = require('../authentication/auth');
const authSchema = require('../authentication/auth.schema');
const issueCookie = require('../middlewares/issueCookie.middleware');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('getting successfully');
});

router.post('/getLoggedinUser', getLoggedInUser);

router.post('/login', inputValidator(inputSchema.loginSchema), loginController, issueCookie);

router.post(
  '/register',
  inputValidator(inputSchema.registerSchema),
  registrationController,
  issueCookie
);

router.post('/teamRegistration', checkAuth(authSchema, 'User'), teamRegistration);

router.post('/getTournament', checkAuth(authSchema, 'User'), getTournament);

router.post('/logout', logoutController);

module.exports = router;
