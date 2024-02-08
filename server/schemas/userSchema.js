const Joi = require('joi');

const userRegisterValidationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const userGetValidationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  userRegisterValidationSchema,
  userGetValidationSchema,
};