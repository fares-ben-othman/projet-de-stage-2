const Joi = require('joi');

const agenceSchema = Joi.object({
    nom: Joi.string().max(100).required(),
    adresse: Joi.string().required(),
    ville: Joi.string().max(100).optional().allow(null, ''),
    telephone: Joi.string().max(20).optional().allow(null, ''),
    email: Joi.string().email().max(100).optional().allow(null, ''),
    is_deleted: Joi.boolean().optional(),
    deleted_at: Joi.date().optional().allow(null)
});

module.exports = { agenceSchema };

