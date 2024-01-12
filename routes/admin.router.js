const checkAuth = require('../authentication/auth');
const authSchema = require('../authentication/auth.schema');
const {
  getUsersController,
  createTournament,
  getAllTournaments,
  verifyTeamController,
  teamsController,
  handleSaveHomepage
} = require('../controllers/admin.controller');
const Team = require('../models/team.model');
const resError = require('../utilities/resError');
const inputValidator = require('../validation');
const inputSchema = require('../validation/validationSchema');
const router = require('express').Router();

//  protected route | admin can access this route
router.post('/getUsers', checkAuth('Administrator'), getUsersController);

router.post(
  '/createTournament',
  inputValidator(inputSchema.createTournament),
  checkAuth('Administrator'),
  createTournament
);

router.post('/getAllTournaments', checkAuth('Administrator'), getAllTournaments);

router.post('/teams', checkAuth('Administrator'), teamsController);

router.post('/verifyTeam', checkAuth('Administrator'), verifyTeamController);

router.post('/save-homepage', checkAuth('Administrator'), handleSaveHomepage);

// router.post(
//   '/adminForceRegistration',
//   checkAuth(authSchema, 'Administrator'),
//   inputValidator(inputSchema.registerSchema),
//   adminForceRegistration
// );

module.exports = router;
