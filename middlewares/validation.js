const Joi = require('joi');

// Middleware de validation générique basé sur Joi
module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
