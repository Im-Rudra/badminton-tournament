//  external requires
const express = require('express');
const _ = require('lodash');

//  internal imports
const inputValidator = require('../validation');
const inputSchema = require('../validation/validationSchema');
const {
  registrationController,
  loginController,
  logoutController,
  getLoggedInUser,
  getTournaments,
  teamRegistration,
  checkTeamRegistrablity,
  getMyRegistrations,
  deleteTeamController,
  checkoutSessionController,
  verifyTeamController,
  handleGetHomepage
} = require('../controllers/user.controller');
const checkAuth = require('../authentication/auth');
const issueToken = require('../middlewares/issueToken');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('server running successfully');
});

router.get('/test', (req, res) => {
  // console.log(req.headers);
  // res.header('x-auth-token', 'Hello world token');
  console.log(req.headers.host);
  res.send('ok');
});

router.post('/getLoggedinUser', getLoggedInUser);

router.post('/login', inputValidator(inputSchema.loginSchema), loginController, issueToken);

router.post(
  '/register',
  inputValidator(inputSchema.registerSchema),
  registrationController,
  issueToken
);

router.post('/checkTeamRegistrablity', checkAuth('User'), checkTeamRegistrablity);

router.post(
  '/teamRegistration',
  checkAuth('User'),
  inputValidator(inputSchema.teamRegistration),
  checkTeamRegistrablity,
  teamRegistration
);

router.get('/open-tournaments', checkAuth('User'), getTournaments);

router.post('/logout', logoutController);

router.get('/myRegistrations', checkAuth('User'), getMyRegistrations);

router.post(
  '/deleteTeam',
  checkAuth('User'),
  inputValidator(inputSchema.deleteTeam),
  deleteTeamController
);

router.post(
  '/create-checkout-session',
  checkAuth('User'),
  inputValidator(inputSchema.checkoutSession),
  checkoutSessionController
);

// implimented for automatic payment success-page of frontend
// router.post(
//   '/verifyTeam',
//   checkAuth('User'),
//   inputValidator(inputSchema.verifyTeam),
//   verifyTeamController
// );

router.get('/homepage', handleGetHomepage);

module.exports = router;
