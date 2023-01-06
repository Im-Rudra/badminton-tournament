const checkAuth = require('../authentication/auth');
const authSchema = require('../authentication/auth.schema');
const {
  getUsersController,
  createTournament,
  getAllTournaments
} = require('../controllers/admin.controller');
const inputValidator = require('../validation');
const inputSchema = require('../validation/validationSchema');
const router = require('express').Router();

//  protected route | admin can access this route
router.post('/getUsers', checkAuth(authSchema, 'Administrator'), getUsersController);

router.post(
  '/createTournament',
  inputValidator(inputSchema.createTournament),
  checkAuth(authSchema, 'Administrator'),
  createTournament
);

router.post('/getAllTournaments', checkAuth(authSchema, 'Administrator'), getAllTournaments);

module.exports = router;
