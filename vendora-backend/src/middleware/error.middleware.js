// @module shared | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const { sendError } = require('../utils/response');

function errorMiddleware(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error && error.code === 11000) {
    return sendError(res, 'A record with the same unique value already exists.', 409, 'DUPLICATE_ENTRY');
  }
  if (error && error.name === 'CastError') {
    return sendError(res, 'Invalid identifier or field value.', 400, 'INVALID_REFERENCE');
  }
  if (error && error.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid authentication token.', 401, 'INVALID_TOKEN');
  }
  if (error && error.name === 'TokenExpiredError') {
    return sendError(res, 'Authentication token has expired.', 401, 'TOKEN_EXPIRED');
  }
  if (error && (error.name === 'ValidationError' || error.name === 'MongoServerError' && error.code === 121)) {
    return sendError(res, error.message || 'Validation failed.', 422, 'VALIDATION_ERROR');
  }
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error.' : error.message;
  return sendError(res, message || 'Internal server error.', 500, 'INTERNAL_ERROR');
}

module.exports = { errorMiddleware };
