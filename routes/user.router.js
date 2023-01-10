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
  getTournament,
  teamRegistration,
  checkTeamRegistrablity
} = require('../controllers/user.controller');
const { getUsersController } = require('../controllers/admin.controller');
const checkAuth = require('../authentication/auth');
const authSchema = require('../authentication/auth.schema');
const issueCookie = require('../middlewares/issueCookie.middleware');
const Team = require('../models/team.model');
const Tournament = require('../models/tournament.model');
const resError = require('../utilities/resError');
const issueToken = require('../middlewares/issueToken');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('server running successfully');
});

router.get('/test', (req, res) => {
  console.log(req.headers);
  res.header('x-auth-token', 'Hello world token');
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

router.post('/getTournament', checkAuth('User'), getTournament);

router.post('/logout', logoutController);

module.exports = router;
