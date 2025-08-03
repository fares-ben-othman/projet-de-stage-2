const Joi = require('joi');

const clientSchema = Joi.object({
  nom: Joi.string().max(100).required(),
  prenom: Joi.string().max(100).allow(null, ''),
  email: Joi.string().email().max(100).allow(null, ''),
  telephone: Joi.string().max(20).required(),
  cin: Joi.string().max(20).allow(null, ''),
});

module.exports = {
  clientSchema,
};
