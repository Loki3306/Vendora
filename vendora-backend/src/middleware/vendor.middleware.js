// @module vendor | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const { Vendor } = require('../models');
const { sendError } = require('../utils/response');

async function vendorVerified(req, res, next) {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user.user_id }).lean();
    if (!vendor || vendor.status !== 'verified') {
      return sendError(res, 'Vendor account must be verified to access this resource.', 403, 'VENDOR_NOT_VERIFIED');
    }
    req.user.vendor_id = vendor.vendor_id;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { vendorVerified };
