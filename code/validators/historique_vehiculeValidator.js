const Joi = require('joi');

const validTypeActions = ['maintenance', 'reparation', 'nettoyage', 'autre']; 

const historiqueVehiculeSchema = Joi.object({
  vehicule_id: Joi.number().integer().positive().required(),
  date_action: Joi.date().optional(), 
  type_action: Joi.string().valid(...validTypeActions).required(),
  description: Joi.string().allow(null, '').optional(),
  utilisateur_id: Joi.number().integer().positive().allow(null).optional(),
});

module.exports = {historiqueVehiculeSchema};
