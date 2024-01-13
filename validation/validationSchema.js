let Joi = require('joi');
Joi = Joi.extend(require('joi-phone-number'));

const schemas = {
  registerSchema: Joi.object({
    firstName: Joi.string().required().min(2),
    lastName: Joi.string().required().min(2),
    email: Joi.string().required().email(),
    phone: Joi.string().required(),
    // phone: Joi.string().required().phoneNumber({ format: 'e164' }),
    password: Joi.string().required().min(6),
    remember: Joi.boolean()
    // role: Joi.string().required().valid('Administrator', 'Moderator', 'User')
  }),
  loginSchema: Joi.object({
    email: Joi.string().email(),
    // phone: Joi.string().phoneNumber({ format: 'international' }),
    password: Joi.string().required().min(6),
    remember: Joi.boolean().required().default(true)
  }),
  requestSchema: Joi.object({
    fromID: Joi.string().hex().length(24),
    toID: Joi.string().hex().length(24)
  }),
  createTournament: Joi.object({
    tournamentName: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    singlePlayerEntryFee: Joi.number().required(),
    doublePlayerEntryFee: Joi.number().required(),
    tournamentYear: Joi.string()
  }),
  teamRegistration: Joi.object({
    tournament: Joi.string().hex().length(24).required(),
    teamName: Joi.string().required(),
    teamType: Joi.string().required().valid('Single', 'Double'),
    fullName_2: Joi.string(),
    phone_2: Joi.string()
  }),
  deleteTeam: Joi.object({
    teamId: Joi.string().hex().length(24).required()
  }),
  checkoutSession: Joi.object({
    teamId: Joi.string().hex().length(24).required()
  }),
  verifyTeam: Joi.object({
    teamId: Joi.string().hex().length(24).required(),
    sessionId: Joi.string().required()
  }),
  saveHomepage: Joi.object({
    id: Joi.string().hex().length(24),
    blocks: Joi.string().required()
  })
};

module.exports = schemas;
