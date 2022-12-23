//  external requires
const express = require('express');

//  internal imports
const inputValidator = require('../validation');
const inputSchema = require('../validation/validationSchema');
const {
  registrationController,
  loginController,
  logoutController
} = require('../controllers/user.controller');
const { checkLoggedIn } = require('../middlewares/login.middleware');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('getting successfully');
});

router.post('/user-info');

router.post('/login', inputValidator(inputSchema.loginSchema), checkLoggedIn, loginController);

router.post('/register', inputValidator(inputSchema.registerSchema), registrationController);

router.post('/logout', logoutController);

module.exports = router;
