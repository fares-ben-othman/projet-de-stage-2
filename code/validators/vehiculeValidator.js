const Joi = require('joi');

const vehiculeSchema = Joi.object({
  immatriculation: Joi.string().max(20).required(),
  marque: Joi.string().max(50).allow(null, ''),
  modele: Joi.string().max(50).allow(null, ''),
  annee: Joi.number().integer().min(1900).max(new Date().getFullYear()).allow(null),
  kilometrage: Joi.number().integer().min(0).default(0),
  statut: Joi.string().valid('disponible', 'loue', 'maintenance', 'leasing', 'reserve','transfert').default('disponible'),
  date_assurance: Joi.date().allow(null),
  agence_id: Joi.number().integer().required(),
});

module.exports = {vehiculeSchema};
