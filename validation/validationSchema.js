let Joi = require('joi');
Joi = Joi.extend(require('joi-phone-number'));

const schemas = {
  registerSchema: Joi.object({
    firstName: Joi.string().required().min(2),
    lastName: Joi.string().required().min(2),
    email: Joi.string().required().email(),
    phone: Joi.string().required().phoneNumber({ format: 'e164' }),
    password: Joi.string().required().min(6)
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
  })
};

module.exports = schemas;
