const Joi = require('joi');

const financeSchema = Joi.object({
  type: Joi.string().valid('revenu', 'depense').required(),
  montant: Joi.number().precision(2).min(0).required(),
  vehicule_id: Joi.number().integer().allow(null),
  agence_id: Joi.number().integer().allow(null),
  source: Joi.string().max(100).allow(null, ''),
  date_finance: Joi.date().required(),
  is_deleted: Joi.boolean().default(false),
  deleted_at: Joi.date().allow(null),
});

module.exports = { financeSchema };

