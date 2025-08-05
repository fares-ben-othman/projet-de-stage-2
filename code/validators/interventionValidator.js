const Joi = require('joi');

const interventionSchema = Joi.object({
  vehicule_id: Joi.number().integer().positive().required(),
  type: Joi.string().valid('maintenance', 'reparation', 'nettoyage').required(),
  date_intervention: Joi.date().required(),
  agence_id: Joi.number().integer().positive().required(),
  prestataire: Joi.string().max(150).allow(null, '').optional(),
  cout: Joi.number().precision(2).allow(null).optional(),
  commentaire: Joi.string().allow(null, '').optional(),
  facture_pdf: Joi.string().max(255).allow(null, '').optional()
});

module.exports = { interventionSchema };
