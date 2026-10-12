// @module auth | Vendora v1.0 | SPIT Mini Project AY 2026-27
const { sendError } = require('../utils/response');

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return sendError(res, 'You do not have permission to access this resource.', 403, 'FORBIDDEN');
  }
  return next();
};

const requireCustomer = requireRole('customer');
const requireVendor = requireRole('vendor');
const requireAdmin = requireRole('admin');

module.exports = { requireRole, requireCustomer, requireVendor, requireAdmin };
