const Joi = require('joi');

const roles = ['admin', 'chef_agence', 'agent'];

const utilisateurCreateSchema = Joi.object({
  nom: Joi.string().max(100).required(),
  email: Joi.string().email().max(100).required(),
  mot_de_passe: Joi.string().min(8).max(255).required(), 
  agence_id: Joi.number().integer().allow(null),
  is_active: Joi.boolean().default(true),
});

const utilisateurUpdateSchema = Joi.object({
  nom: Joi.string().max(100),
  email: Joi.string().email().max(100),
  mot_de_passe: Joi.string().min(8).max(255),           
  role: Joi.string().valid(...roles),   
  agence_id: Joi.number().integer().allow(null),
  is_active: Joi.boolean(),
}).min(1); 

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  mot_de_passe: Joi.string().required()
});

module.exports = { utilisateurCreateSchema, utilisateurUpdateSchema, loginSchema };

