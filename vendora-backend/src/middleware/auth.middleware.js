// @module auth | Vendora v1.0 | SPIT Mini Project AY 2026-27
const { verifyToken: verifyJwt } = require('../config/jwt.config');
const { sendError } = require('../utils/response');

function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return sendError(res, 'Authentication token is required.', 401, 'UNAUTHORIZED');
  }
  try {
    req.user = verifyJwt(token);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Authentication token has expired.', 401, 'TOKEN_EXPIRED');
    }
    return sendError(res, 'Invalid authentication token.', 401, 'INVALID_TOKEN');
  }
}

module.exports = { verifyToken };
