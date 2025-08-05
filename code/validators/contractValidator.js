const Joi = require('joi');

const contratValidator = Joi.object({
  client_id: Joi.number().integer().required(),
  vehicule_id: Joi.number().integer().required(),
  agence_id: Joi.number().integer().required(),
  
  date_debut: Joi.date().required(),
  date_fin: Joi.date().min(Joi.ref('date_debut')).required(),

  montant: Joi.number().precision(2).positive().required(),
  remise: Joi.number().precision(2).min(0).max(100).default(0),

  options_assurance: Joi.boolean().default(false),
  options_gps: Joi.boolean().default(false),
  options_conducteur_add: Joi.boolean().default(false),

  etat_pickup: Joi.string().valid('neuf', 'bon', 'abime', 'accidenté', 'autre').default('bon'),
  km_initial: Joi.number().integer().min(0),
  carburant_initial: Joi.number().precision(2).min(0).max(100),

  etat_dropoff: Joi.string().valid('neuf', 'bon', 'abime', 'accidenté', 'autre').default('bon'),
  km_final: Joi.number().integer().min(0),
  carburant_final: Joi.number().precision(2).min(0).max(100),

  frais_supplementaires: Joi.number().precision(2).min(0).default(0),
  rapport_restitution: Joi.string().allow('', null),

  is_deleted: Joi.boolean().default(false),
  deleted_at: Joi.date().allow(null),
});

module.exports = {contratValidator};
