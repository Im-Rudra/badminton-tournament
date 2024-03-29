const checkAuth = require('../authentication/auth');
const {
  getUsersController,
  createTournament,
  getAllTournaments,
  verifyTeamController,
  teamsController,
  saveHomepage
} = require('../controllers/admin.controller');
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

router.post('/verifyTeamAdmin', checkAuth('Administrator'), verifyTeamController);

router.post('/save-homepage', checkAuth('Administrator'), saveHomepage);

// router.post(
//   '/adminForceRegistration',
//   checkAuth(authSchema, 'Administrator'),
//   inputValidator(inputSchema.registerSchema),
//   adminForceRegistration
// );

module.exports = router;
