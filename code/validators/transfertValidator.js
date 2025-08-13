const Joi = require('joi');

const transfertSchema = Joi.object({
  vehicule_id: Joi.number().integer().required(),
  source_agence_id: Joi.number().integer().required(),
  destination_agence_id: Joi.number().integer().required(),
  date_transfert: Joi.date().required(),
  etat: Joi.string().valid('en_cours', 'termine').default('en_cours'),
  is_deleted: Joi.boolean().default(false),
  deleted_at: Joi.date().allow(null)
});

module.exports = { transfertSchema };

