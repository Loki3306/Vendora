// @module auth | Vendora v1.0 | SPIT Mini Project AY 2026-27
const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map((item) => ({ field: item.path, message: item.msg }));
    return sendError(res, 'Validation failed.', 422, 'VALIDATION_ERROR', errors);
  }
  return next();
}

module.exports = { validate };
