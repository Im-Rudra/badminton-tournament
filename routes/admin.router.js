const checkAuth = require("../authentication/auth");
const { ROLES } = require("../constants");
const {
  getUsersController,
  createTournament,
  getAllTournaments,
  verifyTeamController,
  teamsController,
  saveHomepage,
  toggleTournamentStatus,
  makeAdmin,
  exportExcel,
  deleteTeamController,
} = require("../controllers/admin.controller");
const inputValidator = require("../validation");
const inputSchema = require("../validation/validationSchema");
const router = require("express").Router();

//  protected route | admin can access this route
router.post("/getUsers", checkAuth(ROLES.ADMIN), getUsersController);

router.post(
  "/createTournament",
  inputValidator(inputSchema.createTournament),
  checkAuth(ROLES.ADMIN),
  createTournament,
);

router.post("/getAllTournaments", checkAuth(ROLES.ADMIN), getAllTournaments);

router.post("/teams", checkAuth(ROLES.ADMIN), teamsController);

router.post("/verifyTeamAdmin", checkAuth(ROLES.ADMIN), verifyTeamController);

router.post("/save-homepage", checkAuth(ROLES.ADMIN), saveHomepage);

router.put(
  "/toggle-tournament-status/:id",
  inputValidator(inputSchema.toggleTournamentStatus),
  checkAuth(ROLES.ADMIN),
  toggleTournamentStatus,
);

router.put("/make-admin/:userId", checkAuth(ROLES.ADMIN), makeAdmin);

router.get("/export-excel/:tournamentId", checkAuth(ROLES.ADMIN), exportExcel);

router.delete(
  '/deleteTeam/:teamId',
  checkAuth(ROLES.ADMIN),
  // inputValidator(inputSchema.deleteTeam),
  deleteTeamController
);

// router.post(
//   '/adminForceRegistration',
//   checkAuth(authSchema, ROLES.ADMIN),
//   inputValidator(inputSchema.registerSchema),
//   adminForceRegistration
// );

module.exports = router;
